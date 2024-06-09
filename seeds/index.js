const mongoose = require('mongoose');
const cities = require('./cities');
const campgroundData = require('./campgroundData');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const fetch = require('node-fetch');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const unsplashToken = process.env.UNSPLASH_TOKEN
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    // await Campground.deleteMany({});
    for (let campground of campgroundData) {
        const price = Math.floor(Math.random() * 20) + 10;
        const searchTerm = campground.keywords.join(',');
        const count = 5; // Specify the number of images you want to retrieve
        const url = `https://api.unsplash.com/photos/random?client_id=${unsplashToken}&query=${searchTerm}&count=${count}`;
        const response = await fetch(url);
        const data = await response.json();
        const images = data.map(item => {
            return { url: item.urls.small, filename: `YelpCamp/${item.id}` }
        })
        const camp = new Campground({
            author: '6665f89bd86d080043eba2cd',
            location: `${campground.city}, ${campground.location}`,
            title: campground.name,
            description: campground.description,
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    campground.longitude,
                    campground.latitude,
                ]
            },
            images,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})
// console.log(campgroundData.length)

