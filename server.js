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

var message_counter = 0;

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

        // Blank comment

		//message_counter = message_counter + 1;

		//var response_from_narad_muni;

		//if (message_counter == 1)
		//{
		//	response_from_narad_muni = "Go to Pi >> Apps >> Leave and Attendance Management System >> Click 'Apply Leave' >> Select Leave Type as Priviledge Leave >> Enter Date >> Mention Comment >> Click Submit. Kindly access LAMS portal using below Internet link if you do not have access to Persistent Intranet";
		//}
		//if (message_counter == 2) {
		//    response_from_narad_muni = "Frequency: Once in six months ( i.e. 2 times in year) Amount: Rs. 400/- per head per duration. The Project Party will be held for a Project/Function as a whole. For the purpose of this policy, Project/Function will be considered as reflected on Persistent Intranet i.e. “Pi”. Policy Link : https://pi.persistent.co.in/sites/Company-Policies/Policy/Project%20party.pdf";
		//}
		//if (message_counter == 3) {
		//    response_from_narad_muni = "Pi >> Apps >> Employee Enterprise : Mitra-EP >> Click on 'Professional' >> Go to'Project Experience' >> Add the project details and skill >> Click 'Submit'";
		//}
		//if (message_counter == 4) {
		//    response_from_narad_muni = "Pi >> Apps >> Enterprise Portal Mitra-EP >> Click on Refer a Friend >> Select either 'Quick Referral' or 'Detailed Referral' >> Enter the details and save the profile. There will be applicant ID generated for further processing. HR Self Help Tool Link : https://persistent.yonyx.com/y/conversation/?id=46a439a0-8f8c-11e6-9788-bc764e11d2f4";
		//}
		//if (message_counter == 5) {
		//    response_from_narad_muni = "Please drop email to RecruitmentEnquiries <RecruitmentEnquiries@persistent.com>";
	    //}

	    response_from_narad_muni = getResponseFromAlgo(msg_from_user);

		socket.emit('chat message', response_from_narad_muni);
	});

});



// AI Chatbot API Interface methods

var getResponseFromAIChatBot = function (msg_from_user)
{

    // TODO: Bring this response from AI Chatbot API Interface
    var response_from_agent_bot_1 = "Go to Pi >> Apps >> Leave and Attendance Management System >> Click Apply Leave Select Leave Type as Priviledge Leave >> Enter Date >> Mention Comment >> Click Submit. Kindly access LAMS portal using below Internet link if you do not have access to Persistent Intranet";

    return response_from_agent_bot;
}

var getResponseFromAlgo = function (msg_from_user)
{
    var applyLeave = false;
    var projectPartyBudget = false;
    var updateResume = false;
    var referFriend = false;
    var creditPointsForPromotion = false;

    msg_from_user = msg_from_user.toLowerCase();

    if ((msg_from_user.indexOf("apply") > -1) || (msg_from_user.indexOf("leave") > -1))
    {
        applyLeave = true;
    }

    if (applyLeave == true) {
        response_from_narad_muni = "Go to Pi >> Apps >> Leave and Attendance Management System >> Click 'Apply Leave' >> Select Leave Type as Priviledge Leave >> Enter Date >> Mention Comment >> Click Submit. Kindly access LAMS portal using below Internet link if you do not have access to Persistent Intranet";
    }
    if (projectPartyBudget) {
        response_from_narad_muni = "Frequency: Once in six months ( i.e. 2 times in year) Amount: Rs. 400/- per head per duration. The Project Party will be held for a Project/Function as a whole. For the purpose of this policy, Project/Function will be considered as reflected on Persistent Intranet i.e. “Pi”. Policy Link : https://pi.persistent.co.in/sites/Company-Policies/Policy/Project%20party.pdf";
    }
    if (updateResume) {
        response_from_narad_muni = "Pi >> Apps >> Employee Enterprise : Mitra-EP >> Click on 'Professional' >> Go to'Project Experience' >> Add the project details and skill >> Click 'Submit'";
    }
    if (referFriend) {
        response_from_narad_muni = "Pi >> Apps >> Enterprise Portal Mitra-EP >> Click on Refer a Friend >> Select either 'Quick Referral' or 'Detailed Referral' >> Enter the details and save the profile. There will be applicant ID generated for further processing. HR Self Help Tool Link : https://persistent.yonyx.com/y/conversation/?id=46a439a0-8f8c-11e6-9788-bc764e11d2f4";
    }
    if (creditPointsForPromotion) {
        response_from_narad_muni = "Please refer to the promotion policy to know about the eligiblity criteria and process : https://pi.persistent.co.in/sites/Company-Policies/Policy/Promotion%20policy.pdf#search=PROMOTION For more details connect with ask_hr@persistent.com";
    }

    return response_from_narad_muni;
}
