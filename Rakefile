require './app'
require 'rest-client'

desc 'Populates database from earthquake.usgs.gov'
task :get_data do
  data = RestClient.get "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
  data = JSON.parse(data)

  if !data.nil?
    puts('seeding database...')
    data['features'].each do |feature|
      properties = feature['properties']
      coordinates = feature['geometry']['coordinates']
      Feature.create(
        id: feature['id'],
        mag: properties['mag'],
        place: properties['place'],
        time: properties['time'],
        url: properties['url'],
        tsunami: properties['tsunami'],
        magType: properties['magType'],
        title: properties['title'],
        longitude: coordinates[0],
        latitude: coordinates[1]
      )
    end
    puts('data import completed')
  end
end
