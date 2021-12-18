// jshint esversion:6

// import express, body-parser and https
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

// add an app
const app = express();

// using static files
app.use(express.static("public"));

// enable usage of body-parser
app.use(bodyParser.urlencoded({extended:true}));

// add a root route '/' for GET
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// add a root route '/' for POST
app.post("/", function(req, res) {

  var form_data = req.body;
  var firstName = form_data.firstNameInput;
  var email = form_data.emailInput;
  var lastName = form_data.lastNameInput;
  // Show the captured data on web page
  // res.send(firstName + "<br>" + lastName + "<br>" + email);

  /*** MailChimp API calls ***/
  // audience or list id: [your_list_id]
  // api key: [your_MailChimp_API_Key]
  // endpoint: "https://usXX.api.mailchimp.com/3.0/lists/<your_list_id>/members"
  const url = "https://us20.api.mailchimp.com/3.0/lists/<your_list_id>/members";
  // API call options: JS object
  const options = {
    method: "POST",
    auth: "<your_user_id>:<your_MailChimp_API_Key>",
  }
  // encapsulate the data
  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    }
  };
  // convert the data to JSON string
  const jsonData = JSON.stringify(data);

  // make the request
  const request = https.request(url, options, function(response) {
    // capture response status code
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    // log response data from API call
    response.on("data", function(data) {
      // write response on console for debugging
      responseData = JSON.parse(data)
      console.log(responseData);
    });
  });

  // write the data in request
  request.write(jsonData);
  request.end();
});

// add a listener
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000...");
});
