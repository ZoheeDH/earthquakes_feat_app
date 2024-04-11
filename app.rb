require 'sinatra'
require "sinatra/namespace"
require 'dotenv/load'
require 'mongoid'
require 'mongoid_auto_increment'
require 'json'

#Sinatra setup
set :port, (ENV['PORT'] or 3000)

#DB setup
Mongoid.load!(File.join(File.dirname(__FILE__), 'config', 'mongoid.yml'))

#Models
class Feature
  include Mongoid::Document

  auto_increment :feat_id
  field :type, type: String
  embeds_one :quake, store_as: "attributes"
  embeds_one :link, store_as: "links"
  has_many :comments

  validates :quake, presence: true
  validates :link, presence: true
end

class Quake
  include Mongoid::Document
  embedded_in :feature

  field :_id, type: String
  field :external_id, type: String
  field :mag, type: Float
  field :place, type: String
  field :time, type: Integer
  field :tsunami, type: Integer
  field :mag_type, type: String
  field :title, type: String
  embeds_one :coord, store_as: "coordinates"

  validates :external_id, uniqueness: true, presence: true
  validates :title, presence: true
  validates :place, presence: true
  validates :mag_type, presence: true
  validates :mag, inclusion: -1.0..10.0
end

class Coord
  include Mongoid::Document
  embedded_in :quake

  field :_id, type: String
  field :longitude, type: Float
  field :latitude, type: Float

  validates :longitude, presence: true, inclusion: -180.0..180.0
  validates :latitude, presence: true, inclusion: -90.0..90.0
end

class Link
  include Mongoid::Document
  embedded_in :feature

  field :_id, type: String
  field :external_url, type: String

  validates :external_url, presence: true
end

class Comment
  include Mongoid::Document

  field :body, type: String
  belongs_to :feature
end

#Routes
get '/' do
  '/features to get feature list <br/>
  /features?mag_type[]=md&per_page=2&page=3
  to filter by mag_type, page and/or per_page <br/>
  /features/:id/comments to send a POST request with a comment about the feture with id :id <br/><br/>
  mag_types: md,ml,ms,mw,me,mi,mb,mlg (e.g: mag_type[]=md, mag_type[]=md&mag_type[]=ml<br/>
  per_page: default 10, max 1000 (otherwise the default value will be used)'
end

namespace '/api' do
  get '/features' do
    #get filters from url params
    filters = params.select{|k,v| ["mag_type", "page", "per_page"].include?(k)}
    mag_type = filters.key?(:mag_type) ? filters['mag_type'] : nil
    page = filters.key?(:page) ? filters['page'].to_i : 1
    per_page = (filters.key?(:per_page) and filters['per_page'].to_i <= 1000) ? filters['per_page'].to_i : 10

    if (mag_type)
      #fetching data from db if filter by mag_type
      types = []
      mag_type.each do |mt|
        types.push({ 'attributes.mag_type': mt})
      end
      puts(types)
      features = Feature.any_of(types).skip(per_page*(page-1)).limit(per_page).as_json
      total_docs = Feature.any_of(types).count
    else
      #fetching data from db if no mag_type filter
      features = Feature.all.skip(per_page*(page-1)).limit(per_page).as_json
      total_docs = Feature.all.count
    end

    #data restructuring
    data = []
    features.each do |feature|
      aux = {
        'id' => feature['feat_id'],
        'type' => feature['type'],
        'attributes' => feature['attributes'],
        'links' => feature['links']
      }
      data.push(aux)
    end

    pagination = {
        :current_page => page,
        :total => total_docs%per_page == 0 ? total_docs/per_page : (total_docs/per_page)+1,
        :per_page => per_page
      }

      response = {
        :data => data,
        :pagination => pagination
      }
    status 200
    body JSON.generate(response)
  end

  post '/features/:id/comments' do |id|
    puts id
    feature = Feature.find_by(feat_id: id)
    begin
      body = JSON.parse(request.body.read)
      if (!body['body'] or body['body']=="")
        halt 400, JSON.generate({ error: "body is empty or missing in request" })
      else
        comment = feature.comments.create!(body)
        status 200
        body 'comment created'
      end
    rescue WEBrick::HTTPStatus::LengthRequired
      status 400
      body JSON.generate({ error: "body is missing in request" })
    end
  end
end
