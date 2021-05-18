// import the require dependencies


// import {ApolloServer,gql} from "apollo-server-express"

const express_graphql=require('express-graphql')
const {gql}=require("apollo-server-express")
const {graphql}=require('graphql')

const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema
} = require("graphql");
var express = require("express");var app = express();


const schema = require('./schema/schema');

var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var mysql = require('mysql');
app.set("view engine", "ejs");
var bcrypt = require('bcryptjs');
const fs = require("fs");
const util = require("util");
const pipeline = util.promisify(require("stream").pipeline);
// app.use(express.static(__dirname + "/public"));    Commented this for mongo

const { graphqlHTTP } = require('express-graphql');



const mongoose = require('mongoose');
const uri = "mongodb+srv://danesh123:danesh123@splitwisecluster.qrygt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const passport = require("passport");
const db = require("./config/keys").mongoURI;
const users = require("./routes/users");
const group = require("./routes/groups");
const fileRoutes = require("./routes/imageupload");
const bills = require("./routes/bills");
const transaction = require("./routes/transaction");


app.use(express.json());
// use cors to allow cross origin resource sharing
app.use(cors({origin: "http://localhost:3000", credentials: true}));


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// use express session to maintain session data

app.use("/graphql",graphqlHTTP({
  schema,
  graphiql: true
}));



mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));



// Passport middleware
// app.use(passport.initialize());
// // Passport config
// require("./config/passport")(passport);
// // Routes
// app.use("/users", users);
// app.use("/groups", group);
// app.use("/upload", fileRoutes);
// app.use("/bills", bills);
// app.use("/transaction", transaction);


// app.use(/graphql)


app.listen(3001);
console.log("Server Listening on port 3001");

module.exports=app;