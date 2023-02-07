//jshint esversion: 6

const express = require('express');

const bodyParser = require('body-parser');
const https = require('https');
const { STATUS_CODES } = require('http');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/newsletter.html")

})

app.post('/', (req, res) => {


    //1. First parse the data from the form to the server
    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const emailAddress = req.body.email;
    // console.log(firstname, lastname, emailAddress);


    //2. Create an object in the "const data" using the {required} parameters from mailchimp API 
    const data = {
        members: [{
            email_address: emailAddress,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            },
        }]
    };

    // 3. Convert the data to javascript with JSON.stringify
    const jsonData = JSON.stringify(data);

    // 4. Add the mailchimp url with list id
    const url = "https://us4.api.mailchimp.com/3.0/lists/da765b99b5";

    const options = {
        method: "POST",
        auth: "bibibusiness:c6a0f06eadb19af9e84e072c0856031d-us4"
    }
    //5. Create the https request passing in the url and options variable defined above and then adding a callback function that will respond with the data it receives and print in the server as a JSON.
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failed.html");
        }


        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });



    });

    request.write(jsonData);
    request.end();

});

app.post("/failed", (req, res) => {
    res.redirect("/");
})

app.post("/success", (req, res) => {
    res.redirect("/");
})



app.listen('3000', function () {
    console.log('server is running at port 3000');
})

//API key: c6a0f06eadb19af9e84e072c0856031d-us4

// list Id: da765b99b5