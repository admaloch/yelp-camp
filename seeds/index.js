const mongoose = require('mongoose');
const cities = require('./cities');
const campgroundData = require('./campgroundData');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const fetch = require('node-fetch');



mongoose.connect('mongodb://localhost:27017/yelp-camp');

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
        const accessKey = '_2Nq_YNn7y7gbcweITcuLKyol_Zh49mw3J6QyZ2OwT0'; // Replace 'your_access_key' with your actual access key
        const count = 5; // Specify the number of images you want to retrieve
        const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}&query=${searchTerm}&count=${count}`;
        const response = await fetch(url);
        const data = await response.json();
        const images = data.map(item => {
            return { url: item.urls.small, filename: `YelpCamp/${item.id}` }
        })
        const camp = new Campground({
            author: '6646109e1c2497363d52ef89',
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

// console.log(campgroundData[0].keywords.join(','))

// const searchKeys = campgroundData[0].keywords.join(',');
// const searchTerm = `${campgroundData[0].city},${searchKeys}`
// console.log(searchTerm)

console.log(campgroundData.length)


// console.log(campgroundData.length)
