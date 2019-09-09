const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
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

app.get('/', (req, res) =>
	res.status(200).sendFile(__dirname + '/views/index.html')
);

app.post('/dashboard', (req, res) => {
	if (req.body.username === user && req.body.password === pass) {
		res.sendFile(__dirname + '/views/dashboard.html');
	} else {
		res.status(200).send('Wrong Username/Password combination!');
	}
	console.log('Received a POST request to /dashboard. Payload: ', req.body);
});

client
	.connect()
	.then(() => {
		console.log('Connected to MongoDB!');
		app.get('/sessions-active', (req, res) => {
			const db = client.db(dbName);
			const collection = db.collection('sessions-active');
			collection.find({}).toArray(function(err, docs) {
				console.log(
					'Received a GET request to /sessions-active. Found the following records:'
				);
				console.log(docs);
				//Send the array to the client
				res.status(200).send(docs);
			});
		});
		app.get('/sessions-finished', (req, res) => {
			const db = client.db(dbName);
			const collection = db.collection('sessions-finished');
			collection.find({}).toArray(function(err, docs) {
				console.log(
					'Received a GET request to /sessions-finished. Found the following records:'
				);
				console.log(docs);
				//Send the array to the client
				res.status(200).send(docs);
			});
		});
		app.post('/sessionHandler', (req, res) => {
			const db = client.db(dbName);
			//Check if the POST payload {"name":} is in the sessions-active collection
			let collection = db.collection('sessions-active');
			collection
				.find({ user: req.body.name })
				.toArray()
				.then(docs => {
					if (docs.length != 0) {
						console.log(
							'Issued a collection.find({}) command. Found the following:'
						);
						console.log(docs);
						//Clone it to the sessions-finished collection together with the end date and fee
						collection = db.collection('sessions-finished');
						let endDate = new Date().toLocaleString();
						const fee = (
							((Date.parse(endDate) - Date.parse(docs[0].start)) *
								feePerMinute) /
							1000 /
							60
						).toFixed(2);
						//Insert the document into the DB collection
						collection.insertOne({
							user: req.body.name,
							start: docs[0].start,
							end: endDate,
							fee: fee
						});
						//Remove it from the sessions-active collection
						collection = db.collection('sessions-active');
						collection.deleteOne({ user: req.body.name }).then(() => {
							console.log(
								'Removed the document with the field name equal to ' +
									req.body.name
							);
						});
					} else {
						//Create a new document in the sessions-active collection
						console.log(
							`Didnt find ${req.body.name} in the session-active, will add it now`
						);
						let startDate = new Date().toLocaleString();
						collection = db.collection('sessions-active');
						collection.insertOne({ user: req.body.name, start: startDate });
					}
					res.Status(200).send('CACAT');
				})
				.catch(err => {
					throw new Error(
						'Something bad happened while trying to look in the database'
					);
					res.sendStatus(500);
				});
		});
	})
	.catch(err => {
		console.log('Error connecting to MongoDB: ', err);
	});

app.listen(port, () => console.log(`Listening on port ${port}!`));
