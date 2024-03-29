//set up
let express = require('express')
let app = express();
let bodyParser = require('body-parser')

let databasePosts= null;


//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));


// pick and return a random element from the given list
function pickRandomFrom(list) {
  return list[Math.floor(Math.random()*list.length)];
};
//give the client a random post
function getRandomPost(request, response) {
  console.log(request.params.category)
  const matchingPosts = posts.filter(p => p.category && p.category.toLowerCase() === request.params.category.toLowerCase());
  let randomPost = pickRandomFrom(matchingPosts);
  response.send(randomPost);
  
};

app.get('/random/:category', getRandomPost);

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
let posts = [];

//let a client GET the list
function sendPostsList(request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

//let a client POST something new
function saveNewPost(request, response) {
  console.log(request.body.message); //write it on the command prompt so we can see
 let post= {};
 post.message = request.body.message;
 post.time = new Date();
 post.image = request.body.image;
 post.category = request.body.category;
 if (post.image === "") {
  post.image = "https://i.imgur.com/ENri5dM.jpg"
   }
 posts.push(post);
  response.send("thanks for your message. Press back to add another");
  databasePosts.insert(post);
}
app.post('/posts', saveNewPost);

let MongoClient = require('mongodb').MongoClient;
let databaseUrl = 'mongodb://girlcode:hats123@ds045694.mlab.com:45694/girlcode2019-term3'
let databaseName = 'girlcode2019-term3';
 
MongoClient.connect(databaseUrl, {useNewUrlParser: true}, function(err, client) {
  if (err) throw err;
  console.log("yay we connected to the database");
  let database = client.db(databaseName);
  databasePosts = database.collection('posts');
  databasePosts.find({}).toArray(function(err, results) {
    if (err) throw err;
    console.log("Found " + results.length + " results");
    posts = results
  });
});


//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");