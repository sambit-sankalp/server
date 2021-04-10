// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// create an instance of express to serve our end points
const app = express();

// we'll load up node's built in file system helper library here
// (we'll be using this later to serve our JSON files
const fs = require('fs');

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is where we'll handle our various routes from
app.get('/', (req, res) => {
  res.send('welcome to the development api-server');
});

// variables
const dataPath = './files/data.json';
  
// refactored helper methods
const readFile = (
 callback,
 returnJson = false,
 filePath = dataPath,
 encoding = 'utf8'
) => {
 fs.readFile(filePath, encoding, (err, data) => {
   if (err) {
     throw err;
   }

   callback(returnJson ? JSON.parse(data) : data);
 });
};

const writeFile = (
 fileData,
 callback,
 filePath = dataPath,
 encoding = 'utf8'
) => {
 fs.writeFile(filePath, fileData, encoding, err => {
   if (err) {
     throw err;
   }

   callback();
 });
};

 // READ
 // Notice how we can make this 'read' operation much more simple now.
 app.get('/users', (req, res) => {
   readFile(data => {
     res.send(data);
   }, true);
 });

 // CREATE
app.post('/users', (req, res) => {
   readFile(data => {
 
     // add the new user
     data[uuidv4()] = req.body;
 
     writeFile(JSON.stringify(data, null, 2), () => {
       res.status(200).send('new user added');
     });
   }, true);
 });

 // UPDATE
app.put('/users/:id', (req, res) => {
   readFile(data => {
     // add the new user
     const userId = req.params['id'];
     data[userId] = req.body;
 
     writeFile(JSON.stringify(data, null, 2), () => {
       res.status(200).send(`users id:${userId} updated`);
     });
   }, true);
 });

 // DELETE
app.delete('/users/:id', (req, res) => {
   readFile(data => {
     // add the new user
     const userId = req.params['id'];
     delete data[userId];
 
     writeFile(JSON.stringify(data, null, 2), () => {
       res.status(200).send(`users id:${userId} removed`);
     });
   }, true);
 });

 app.get('/users/all',(req,res)=>{
   res.sendFile(__dirname + '/files/users.html');
 });

 app.get('/users/all/:id',(req,res)=>{
  res.sendFile(__dirname + '/files/uniqueuser.html');
 });

// finally, launch our server on port 3001.
const server = app.listen(3000, () => {
  console.log('listening on port');
});