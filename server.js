'use strict';

// Socket.IO variables
var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var path = require('path');

//// MongoDB variables
//var mongodb = require("mongodb");
//var ObjectID = mongodb.ObjectID;

//var CONTACTS_COLLECTION = "contacts";

//// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
//var db;

//// Connect to the database before starting the application server.
////mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
////mongodb://Semicolon:semicolon@123@ds161209.mlab.com:61209/semicolon
////mongodb://<dbuser>:<dbpassword>@ds161209.mlab.com:61209/semicolon
//mongodb.MongoClient.connect("mongodb://vikram:vikram@ds161209.mlab.com:61209/semicolon", function (err, database) {
//    if (err) {
//        console.log(err);
//        process.exit(1);
//    }

//    // Save database object from the callback for reuse.
//    db = database;
//    console.log("Database connection ready");

//    // Initialize the app.
//    var server = app.listen(process.env.PORT || 8080, function () {
//        var port = server.address().port;
//        console.log("App now running on port", port);
//    });
//});

// OLD WebServe Logic to serve files

//var server = http.createServer(function (request, response) {
//    var path = url.parse(request.url).pathname;

//    //switch (path) {
//    //    case '/':
//    //        path = "/chat.html";
//    //        break;
//    //    case '/index':
//    //        path = "/index.html";
//    //        break;
//    //    case '/dashboard':
//    //        path = "/dashboard.html";
//    //        break;
//    //    default:
//    //        path = "/chat.html";
//    //        break;
//    //}

//    // Render the html file mentioned in the path variable to the client
//    fs.readFile(__dirname + path, function (error, data) {
//        if (error) {
//            response.writeHead(404);
//            response.write('File not found!');
//            response.end();
//        }
//        else {
//            response.writeHead(200, { 'Content-Type': 'text/html' });
//            response.write(data, "utf8");
//            response.end();
//        }
//    });
//});


// NEW WebServe Logic to serve files

var server = http.createServer(function (request, response) {
    var filePath = url.parse(request.url).pathname;
    if (filePath == '/')
        filePath = '/index.html';

    filePath = __dirname + filePath;
    var extname = path.extname(filePath);
    var contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }


    fs.exists(filePath, function (exists) {

        if (exists) {
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
    });
});

// Use this while debugging in node-debug
//server.listen(8001);

// Use this while deploying to heroku
server.listen(process.env.PORT);

var listener = io.listen(server);

//global.testContext = 0;
/* Array that holds the location data of all the devices currently connected */
global.deviceLocationData = [];
/* Array that holds the session data for all the connected clients */
global.allClients = [];


listener.sockets.on('connection', function (socket) {
	/* Push the current socket to the allClients array */
	allClients.push(socket);
	var deviceSessionId = allClients.indexOf(socket);

	socket.emit('deviceSessionData', { 'deviceSessionId': deviceSessionId });

	socket.on('disconnect', function () {
		console.log('Got disconnect!');

		var deviceSessionId = allClients.indexOf(socket);
		/* Remove the session from the allClients array */
		allClients.splice(deviceSessionId, 1);

		/* Remove the location data from the deviceLocationData array */
		deviceLocationData.splice(deviceSessionId, 1);

	});

	socket.on('chat message', function (msg_from_user) {

		// TODO: Move this code to a new method saveRecordToMongoDB()

		//newContact.userName = "Ramnath";
		//newContact.lastName = "Damodar";

		//db.collection(CONTACTS_COLLECTION).insertOne(newContact, function (err, doc) {
		//    if (err) {
		//        handleError(response, err.message, "Failed to create new contact.");
		//    } else {
		//        response.status(201).json(doc.ops[0]);
		//    }
		//});

		var response_from_narad_muni = getResponseFromAIChatBot();
		socket.emit('chat message', response_from_narad_muni);
	});

});

// AI Chatbot API Interface methods

var getResponseFromAIChatBot = function (msg_from_user)
{
    // TODO: Bring this response from AI Chatbot API Interface
    //var response_from_agent_bot = "Narayan! Narayan! Bolo Watse, kis duwidha mein ho?";

    var response_from_agent_bot = FindalltheWords(msg_from_user);

    return response_from_agent_bot;
}

function FindalltheWords(sentence) {
    diffWords = [];
    words = sentence
                  .replace(/[.,?!;()"'-]/g, " ")
                  .replace(/\s+/g, " ")
                  .toLowerCase()
                  .split(" ");
    words.forEach(function (word) {
        if (!(diffWords.hasOwnProperty(word))) {
            diffWords.push(word);
        }
    });

    var array = [];
    array = ['from', 'how', 'to', 'want', 'the', 'for', 'in', 'need', 'only'];

    array.forEach(function (word) {
        if ((diffWords.hasOwnProperty(word))) {
            diffWords.pop(word);
        }
    });
    return diffWords;
}
