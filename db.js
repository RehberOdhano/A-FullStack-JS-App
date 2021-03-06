const { MongoClient } = require('mongodb');
require('dotenv').config();

const URL = process.env.URL;

const client = new MongoClient(URL);

const connect_db = async() => {
    await client.connect();
    // const database = client.db("A-FullStack-JS-App"); // will return a db object
    // module.exports = database;
    const db = client;
    module.exports = db;
    // after establishing connection to the database, we'll start our app
    const app = require('./app');

    app.listen((process.env.PORT), () => {
        console.log("SERVER IS STARTED SUCCESSFULLY... WE'RE GOOD TO GO!");
    });
}

connect_db();