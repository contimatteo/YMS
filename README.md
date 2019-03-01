# YMS - Youtube Music Spider
Node JS app for running a youtube's crawler that search and import music videos on mysql database.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Some things you need to install before run the project ✌🏼
```
$ npm install sequelize
$ npm install mysql2
$ npm install -g sequelize-auto
```


## Installing

### Database Setup
Create “*/config*” folder and place there a file called “*config.json*” with this structure:
```
"development": {
    "username": "<db-user>",
    "password": "<db-pasword>",
    "database": "<db-name>",
    "host": "<db-host>",
    "dialect": "mysql",
    "youtube_api_key": "<youtube-api-key>",
    "last_fm_api_key": "YOUR_LASTFM_API_KEY"
  }
```
Insert your database instance informations and generate [YouTube API Key](https://developers.google.com/youtube/v3/getting-started) and [last.fm key](https://www.last.fm/api/account/create).

### Import Migrations
Next, create the structure of the DB running the command:
```
$ npm run import:migrations
```

### Models
Now rename file “*auto-generate-models-example.sh*” into “*/auto-generate-models.sh*” and edit it with your database instance info: 
```
sequelize-auto -o "./Models/BaseStructure/" -d <db-name> -h <db-host> -u <db-user> -p <port> -x <db-password> -e mysql
```

Final step is about create Models from Database tables schema with running
```
$ sh ./auto-generate-models.sh
```
**NB**: the last step should be repeated every time you want to change your local database schema.


## Test Setup

### Models
Check into “*/models/baseStructure/*” list of created Models (number must match with database tables number).

### Migrations
List of tables that must be in your database instance after the migration (see Installing section)
1. Artists
2. ArtistsAndBands
3. Channels
4. FavoriteVideos
5. Genres
6. Productions
7. Users
8. Videos
9. ViewsHistory


## Deployment

Run the node server with hot reloading thanks to Nodemon 🚀
```
$ npm run nodemon
```

If you are a more quite person (but promise not to tell anyone) please use 🛵
```
$ npm run start
```


## Built With

* [Sequelize](https://github.com/sequelize/sequelize) - Multi SQL dialect ORM
* [Sequelize-auto](https://github.com/sequelize/sequelize-auto) - Tools for automatically generate models
* [Passport](https://github.com/jaredhanson/passport) - Authentication Middleware

## Authors

* **Conti Matteo** - *lead of entire project* 
See also the list of [contributors](https://github.com/contimatteo/Youtube-Music-Spider/graphs/contributors) who participated in this project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details

