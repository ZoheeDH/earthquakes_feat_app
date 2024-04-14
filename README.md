# earthquakes_feat_app
The project was developed using Sinatra and MongoDB for the backend and ReactJS with Vite for the frontend

## Instructions
**Important:** MongoDB must be installed and running for the api to work properly

To seed the project from https://earthquake.usgs.gov/ run the following command

```
cd backend
rake get_data
```

To deploy the backend locally run:

```
bundle install
bundle exec ruby app.rb 
```

The api will be deployed in port 3000 or the one provided by an env variable (PORT).


The available routes are:
- GET /api/features _(get features, it can be used with the following parameters: mag_type, page, per_page)_
- POST /api/features/:id/comments _(save a comment for the specified feature)_

To deploy the frontend locally run: 
```
cd frontend
npm install
npm run preview //or npm run dev to start dev server
```

*The frontend was developed using almost no CSS, considering the instructions were to use HTML and JavaScript only
 
