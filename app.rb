require 'sinatra'
require 'mongoid'

#DB setup
Mongoid.load!(File.join(File.dirname(__FILE__), 'config', 'mongoid.yml'))

class Feature
  include Mongoid::Document

  field :id, type: String
  field :mag, type: Float
  field :place, type: String
  field :time, type: Integer
  field :url, type: String
  field :tsunami, type: Integer
  field :magType, type: String
  field :title, type: String
  field :longitude, type: Float
  field :latitude, type: Float

  validates :id, uniqueness: true
  validates :title, presence: true
  validates :url, presence: true
  validates :place, presence: true
  validates :magType, presence: true
  validates :longitude, presence: true, inclusion: -180.0..180.0
  validates :latitude, presence: true, inclusion: -90.0..90.0
  validates :mag, inclusion: -1.0..10.0
end

#Routes
get '/' do
  erb :index
end
