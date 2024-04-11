# frogmi_backend
The backend was developed using Sinatra and MongoDB 

## Instructions
**Important:** MongoDB must be installed and running for the api to work properly

To seed the project from https://earthquake.usgs.gov/ run the following command

```
rake get_data
```

To deploy the backend locally run

```
bundle install
bundle exec ruby app.rb 
```

The api will be deployed in port 3000 or the one provided by an env variable (PORT).


The available routes are:
- GET /  _(shows general info)_
- GET /api/features _(get features, it can be used with the following parameters: mag_type, page, per_page)_
- POST /api/features/:id/comments _(save a comment for the specified feature)_
 
