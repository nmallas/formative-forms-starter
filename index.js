const express = require("express");
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();
const port = process.env.PORT || 8081;

app.set("view engine", "pug");

app.use(express.urlencoded({ extended: false }));


app.use(cookieParser()); // Adding cookieParser() as application-wide middleware
const csrfProtection = csrf({ cookie: true }); // creating csrfProtection middleware to use in specific routes
// app.use(csrfProtection);

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/", (req, res) => {
  res.render("index", { users })
});

app.get("/create", csrfProtection, (req, res) => {
  let data = {firstName: "", lastName: "", email: "", password: "", confirmedPassword: ""}
  res.render("create-user", {csrfToken: req.csrfToken(), data})
});

app.post("/create", csrfProtection, (req, res) => {
  let errors = [];
  let data = {};
  if (!req.body.firstName) {
    errors.push("Please provide a first name.")
    data.firstName = "";
  } else {
    data.firstName = req.body.firstName;
  }
  if (!req.body.lastName) {
    errors.push("Please provide a last name.")
    data.lastName = "";
  } else {
    data.lastName = req.body.lastName;
  }
  if (!req.body.email) {
    errors.push("Please provide an email.")
    data.email = "";
  } else {
    data.email = req.body.email;
  }
  if (!req.body.password) {
    errors.push("Please provide a password.")
    data.password = "";
  } else {
    data.password = req.body.password;
  }
  if (req.body.password !== req.body.confirmedPassword) {
    errors.push("The provided values for the password and password confirmation fields did not match.")
    data.password = "";
    data.confirmedPassword = "";
  } else {
    data.confirmedPassword = req.body.confirmedPassword;
  }
  if(errors.length>0){
    // console.log(data);
    res.render("create-user",  {csrfToken: req.csrfToken(), errors, data})
  } else {
    let highestId = 0;
    for(let i=0; i<users.length; i++){
      if(users[i].id>highestId){
        highestId=users[i].id
      }
    }
    let newId = highestId+1;
    let newUser = {id: newId, firstName: data.firstName, lastName: data.lastName, email: data.email};
    users.push(newUser);
    res.redirect("/")
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
