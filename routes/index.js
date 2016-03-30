var express = require('express');
var multer  =   require('multer');
var router = express.Router();
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('userPhoto');
// Upload Stuff (change location of upload folder eventually!)
router.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});


/* Set up mongoose in order to connect to mongo database */ 
var mongoose = require('mongoose'); 
//Adds mongoose as a usable dependency 
mongoose.connect('mongodb://localhost/songDB'); 
//Connects to a mongo database called "commentDB" 
var songSchema = mongoose.Schema({ //Defines the Schema for this database 
	track : Number,
	title : String,
	artist :String,
	album : String,
	length : Number,
	plays : Number,
	songPath : String,
	artworkPath : String,
	year : Number
});

var Song = mongoose.model('Song', songSchema); //Makes an object from that schema as a model
var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
	 console.log('Connected');
});


router.post( '/song', function(req, res, next) { 
		console.log("POST comment route"); //[1] 
		console.log(req.body);
		var newsong = new Song(req.body); //[3]
		console.log(newsong); //[3]
		newsong.save(function(err, post) { //[4]
			if (err) return console.error(err);
			console.log(post);
			res.sendStatus(200);
		});

});

/* GET comments from database */
router.get('/song', function(req, res, next) {
	console.log("In the GET route");
	Song.find(function(err,commentList) { //Calls the find() method on your database
		if (err) return console.error(err); //If there's an error, print it out
		else {
			console.log(commentList); //Otherwise console log the comments you found
			res.json(commentList); //Then send them
		}
	})
});

var fs = require('fs');
var mm = require('musicmetadata');

router.get('/metadata',function(req,res,next) {

	var parser = new mm(fs.createReadStream('/home/bitnami/htdocs/CS360/finalPro/public/songs/song1.flac'));
	parser.on('metadata', function(result) {
		console.log(result);
		res.json(result);
	});
});

module.exports = router;
