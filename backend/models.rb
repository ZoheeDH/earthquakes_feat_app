require 'mongoid'
require 'mongoid_auto_increment'

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
