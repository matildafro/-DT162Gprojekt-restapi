var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser'); //har laddat ner body-parser
router.use(
    bodyParser.urlencoded({
      extended: true
    })
)
router.use(bodyParser.json());

/********************************************* 
 * Initiera databas och connection
 *********************************************/
var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/projectUni', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise; // global användning
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) { // Lyssnar efter databas-händelser
	console.log("Connected to db");
	// Skapa databas-schema
	var insertSchema = mongoose.Schema({
		name: String,
		uni: String,
		orient: String,
		points: Number
	});
	// Skapar model döpt Insert
	var Insert = mongoose.model('Insert', insertSchema )

/********************************************* 
 * Get complete inserts listing
 *********************************************/
router.get('/', function(req, res, next) {

	// Läs ut från databasen
	Insert.find(function(err, inserts) {
		if(err) return console.error(err);  
		var jsonObj = JSON.stringify(inserts);
		res.contentType('application/json');
		res.send(jsonObj);
	  });
	});

/********************************************* 
 * Get unique insert id
 *********************************************/
 router.get('/:id', function(req, res, next) {

	var id = req.params.id;
	var ind = -1;

	Insert.find(function(err, inserts) {
		if(err) return console.error(err);  
	for(var i=0; i < inserts.length; i++){
		if(inserts[i]._id == id) ind = i; // Hitta arrayen med index som har _id = id   
	} 
	console.log(inserts[ind]);
	res.contentType('application/json');
	res.send(ind>=0?inserts[ind]:'{}'); // Om vi hittar kursen skicka det som svar annars tom array
});
});

/********************************************* 
 * Delete unique insert id
 *********************************************/
router.delete('/:id', function(req, res, next) {
	var id = req.params.id;

// Raderar kurs med _id från databas
Insert.deleteOne({ "_id": id }, function (err) {
	if (err) return handleError(err);
});
// Hämtar listan av kurser
Insert.find(function(err, inserts) {
	if(err) return console.error(err);

	var jsonObj = JSON.stringify(inserts);
	res.contentType('application/json');
	res.send(jsonObj);
});
});


/********************************************* 
 * Add new insert
 *********************************************/
router.post('/', function(req, res, next) {
    // Skapa ny kurs
    var insert1 = new Insert({ 
        name: req.body.name,
		uni: req.body.uni,
		orient: req.body.orient,
		points: req.body.points
    });	
    // Spara ny kurs till db
    insert1.save(function(err) {
        if(err) return console.error(err);
    });

	var jsonObj = JSON.stringify(insert1);
	res.contentType('application/json');
	res.send(jsonObj);

});

/********************************************* 
 * Update one insert
 *********************************************/
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    let updates={}
    if (req.body.name) {
        updates["name"] = req.body.name
    }
    if (req.body.uni) {
        updates["uni"] = req.body.uni
    }
    if (req.body.orient) {
        updates["orient"] = req.body.orient
    }
	if (req.body.points) {
        updates["points"] = req.body.points
    }
    Insert.findByIdAndUpdate(id, updates,
        function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated course : ", docs);
				res.send(updates)
            }
        });

});

}); // DB connection
module.exports = router;