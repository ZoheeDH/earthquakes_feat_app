require './app'
require 'rest-client'

desc 'Populates database from earthquake.usgs.gov'
task :get_data do
  puts('getting data...')
  data = RestClient.get "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
  data = JSON.parse(data)
  puts('seeding database, only data that have not been previously saved will be persisted...')
  if !data.nil?
    data['features'].each do |feature|
      properties = feature['properties']
      coordinates = feature['geometry']['coordinates']
      Feature.create(
        type: 'feature',
        attributes: {
          external_id: feature['id'],
          mag: properties['mag'],
          place: properties['place'],
          time: properties['time'],
          tsunami: properties['tsunami'],
          mag_type: properties['magType'],
          title: properties['title'],
          coordinates: {
            longitude: coordinates[0],
            latitude: coordinates[1]
          }
        },
        links: {
          external_url: properties['url']
        }
      )
    end
    puts('data import completed')
  end
end
