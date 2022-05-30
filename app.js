const express = require('express');
const path =require('path');
const mongoose = require('mongoose');
const ejsMate =require('ejs-mate');
const Campground = require('./models/campground');   // connecting to schema not database why???? 
const methodOverride =require("method-override");


//connection to database 
mongoose.connect('mongodb://localhost:27017/camp-data',{});  //this is also connecting to same database
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open", () =>{
    console.log("Database connected");
});

mongoose.connect("mongodb://localhost:27017/clientDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

const app = express();
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended:true}));         // parse the request body
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.render('index1');
})

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("home");
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        if(foundUser.password === password){
          res.render("home")
        }
      }
    }
  });
});

app.get('/campgrounds',async(req,res)=>{
    const campgrounds =await Campground.find({});     //find all the campgrounds from the database
    res.render('campgrounds/index',{campgrounds});    // {campgrounds} is used to send/render data (that we fetched from the above line) to the index.ejs file
})

app.get('/campgrounds/new' ,async(req,res)=>{
    res.render("campgrounds/new");
})

app.post('/campgrounds', async(req,res)=>{                    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id', async(req,res)=>{
    const campground =await Campground.findById(req.params.id);    
    res.render('campgrounds/show', {campground});
})


app.get('/campgrounds/:id/edit' , async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit",{campground});
})

app.put('/campgrounds/:id',async(req,res)=>{
    const { id } =req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const {id}  =req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

app.listen(3000 , ()=>{
    console.log('Port 3000 Active......');
    
})



// mongoose.connect('mongodb://localhost:27017/camp-data',{
//     // useNewUrlParser : true,   these are automatically true in latest mongoose version
//     // useCreateIndex : true,    
//     // useUnifiedTopolgy : true
// });



// app.get('/',(req,res)=>{
//     //  res.send('Hemlo guys');  // if we use this line then next line will not work
//       res.render('home');
//   })


// app.get('/makecampground',async(req,res)=>{
//     const camp = new Campground({title : 'gemini',description:'camping himalaya'});
//     await camp.save();
//     res.send(camp);
// })

{/* <a href="/campgrounds/<%= campground._id %> /edit">Edit</a> */}
