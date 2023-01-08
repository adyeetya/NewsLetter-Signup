const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const request = require('request');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}))
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: "d6dcfa49535fe697c0ccbde367158208-us21",
  server: "us21"
});


app.get("/", async function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});


app.get("/audience", async (req, res) => {

  const response = await mailchimp.lists.getListMembersInfo("e44fb1ac7d");
  console.log(response);
  res.status(200).json(response);
})



app.post("/", async (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const listId = "e44fb1ac7d";
  const subscribingUser = {
    fName: firstName,
    lName: lastName,
    em: email
  };
  console.log(subscribingUser.fName, subscribingUser.lName, subscribingUser.em);

  const options = {
    method: 'POST',
    url: 'https://us21.api.mailchimp.com/3.0/lists/e44fb1ac7d/members',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic d6dcfa49535fe697c0ccbde367158208-us21'
    },

    body: JSON.stringify({
        email_address: subscribingUser.em,
        status: 'subscribed',
        merge_fields: {
          FNAME: subscribingUser.fName,
          LNAME: subscribingUser.lName
        }
      })
    };



    request(options, function(error, response, body) {
  console.log('Response:', response);
  console.log('Error:', error);
  if (response && response.statusCode === 200) {
    res.sendFile(__dirname +"/success.html");
    console.log(response.statusCode);
  } else {
    res.sendFile(__dirname + "/failure.html");
  }

  console.log("Successfully Added");
});


});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server is running on port 3000")

});
