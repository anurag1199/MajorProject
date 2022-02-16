const mongoose = require('mongoose');
const Campground = require('../models/campground'); // here we are connecting to campground Schema 
// we can write directly here
// const Schema = mongoose.Schema;

// const CampgroundSchema = new Schema({
//     title: String,
//     price: String,
//     description :String,
//     location : String
// });



const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

//connection to database 
mongoose.connect('mongodb://localhost:27017/camp-data',{});  //this is also connecting to same database
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open", () =>{
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const camp = new Campground({
            location: `${cities[i].city},${cities[i].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/183251',
            description:'lorem ipsum sit dolo amen',
            price:90   
        })
        await camp.save();
    }
}

seedDB();