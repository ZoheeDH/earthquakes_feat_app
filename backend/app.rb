require 'sinatra'
require "sinatra/namespace"
require 'dotenv/load'

require 'json'
require './models'

#Sinatra setup
set :port, (ENV['PORT'] or 3000)



#Routes
get '/' do
  '/api/features to get feature list <br/>
  /api/features?mag_type[]=md&per_page=2&page=3
  to filter by mag_type, page and/or per_page <br/>
  /api/features/:id/comments to send a POST request with a comment about the feture with id :id <br/><br/>
  mag_types: md,ml,ms,mw,me,mi,mb,mlg (e.g: mag_type[]=md, mag_type[]=md&mag_type[]=ml<br/>
  per_page: default 1000, (otherwise the default value will be used)'
end

namespace '/api' do
  get '/features' do
    #get filters from url params
    filters = params.select{|k,v| ["mag_type", "page", "per_page"].include?(k)}
    mag_type = filters.key?(:mag_type) ? filters['mag_type'] : nil
    page = filters.key?(:page) ? filters['page'].to_i : 1
    per_page = (filters.key?(:per_page) and filters['per_page'].to_i <= 1000) ? filters['per_page'].to_i : 1000

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
