const { MongoClient } = require('mongodb');
require('dotenv').config();

const URL = process.env.URL;
const client = new MongoClient(URL);

const connect_db = async() => {
    await client.connect();
    client.db();
}

connect_db();