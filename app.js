const express = require('express');
const app = express();
const port = 3000;
const user = 'adi';
const pass = '1234';
const feePerMinute = 0.2; //usd dollars

//MongoDB conf
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url =
	'mongodb+srv://Mozartino:Mozarella920%23@mozzarella-0ndgi.azure.mongodb.net/meh?retryWrites=true&w=majority';
const dbName = 'licenta';

const client = new MongoClient(url, { useNewUrlParser: true });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const insertDocumentSessionActive = function(db, user, date) {
	// Get the documents collection
	const collection = db.collection('sessions-active');
	// Insert some documents
	collection.insertOne({ user: user, start: date });
};
const insertDocumentSessionFinished = function(
	db,
	user,
	startDate,
	endDate,
	fee
) {
	// Get the documents collection
	const collection = db.collection('sessions-finished');
	// Insert some documents
	collection.insertOne({
		user: user,
		start: startDate,
		end: endDate,
		fee: fee
	});
};

const removeDocumentSessionActive = function(db, user) {
	// Get the documents collection
	const collection = db.collection('sessions-active');
	// Delete document where user is specified
	collection.deleteOne({ user: user }, function(err, result) {
		assert.equal(err, null);
		console.log('Removed the document with the field name equal to ' + user);
	});
};

app.post('/sessions-active-add', (req, res) => {
	client.connect(function(err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		const startDate = new Date().toLocaleString();

		insertDocumentSessionActive(db, req.body.name, startDate);
		console.log(req.body);
	});
});
app.post('/sessions-finished-add', (req, res) => {
	//get the start date from the current active session
	client.connect(function(err) {
		assert.equal(null, err);
		console.log('Connected successfully to server!');

		const db = client.db(dbName);
		const collection = db.collection('sessions-active');
		const endDate = new Date().toLocaleString();
		collection.find({}).toArray(function(err, docs) {
			assert.equal(err, null);
			docs.forEach(doc => {
				if (doc.user === req.body.name) {
					console.log('Found the guy!');
					console.log(
						'Now the server will get the startDate to insert it in the finished session document'
					);
					const fee = (
						((Date.parse(endDate) - Date.parse(doc.start)) * feePerMinute) /
						1000 /
						60
					).toFixed(2);
					insertDocumentSessionFinished(
						db,
						req.body.name,
						doc.start,
						endDate,
						fee
					);
					removeDocumentSessionActive(db, req.body.name);
				} else {
					console.log('Did not find the guy!');
				}
			});
		});
	});
});

app.post('/sessions-active-remove', (req, res) => {
	client.connect(function(err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		removeDocumentSessionActive(db, req.body.name);
	});
});

app.get('/sessions-active', (req, res) => {
	//Connect to DB and fetch all documents
	client.connect(function(err) {
		assert.equal(null, err);
		console.log('Connected successfully to server!');

		const db = client.db(dbName);
		const collection = db.collection('sessions-active');
		collection.find({}).toArray(function(err, docs) {
			assert.equal(err, null);
			console.log('Found the following records');
			console.log(docs);
			//Send the array to the client
			res.send(docs);
		});

		// client.close();
	});
});

app.get('/sessions-finished', (req, res) => {
	//Connect to DB and fetch all documents
	client.connect(function(err) {
		assert.equal(null, err);
		console.log('Connected successfully to server!');

		const db = client.db(dbName);
		const collection = db.collection('sessions-finished');
		collection.find({}).toArray(function(err, docs) {
			assert.equal(err, null);
			console.log('Found the following records');
			console.log(docs);
			//Send the array to the client
			res.send(docs);
		});

		// client.close();
	});
});

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));

app.post('/dashboard', (req, res) => {
	if (req.body.username === user && req.body.password === pass) {
		res.sendFile(__dirname + '/views/dashboard.html');
	} else {
		res.send('Wrong username/password');
	}
	console.log(req.body);
});

app.post('/sessionHandler', (req, res) => {
	// Connect to the DB
	client.connect(function(err) {
		assert.equal(null, err);
		console.log('Connected successfully to server!');
		const db = client.db(dbName);

		//Check if the POST name is in the sessions-active collection
		let collection = db.collection('sessions-active');
		collection.find({ user: req.body.name }).toArray(function(err, docs) {
			assert.equal(err, null);
			if (docs.length != 0) {
				console.log('found the following: ', docs);

				//Clone it to the sessions-finished collection together with the end date and fee
				collection = db.collection('sessions-finished');
				const endDate = new Date().toLocaleString();
				const fee = (
					((Date.parse(endDate) - Date.parse(docs[0].start)) * feePerMinute) /
					1000 /
					60
				).toFixed(2);
				insertDocumentSessionFinished(
					db,
					req.body.name,
					docs[0].start,
					endDate,
					fee
				);

				//Remove it from the sessions-active collection
				collection = db.collection('sessions-active');
				removeDocumentSessionActive(db, req.body.name);
			} else {
				//Create a new document in the sessions-active collection
				console.log('didnt find it in the session-active, will add it now');
				const startDate = new Date().toLocaleString();
				insertDocumentSessionActive(db, req.body.name, startDate);
			}
		});

		// client.close();
	});
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
