/*
 * Name: Susan Yang
 * Date: July 27th, 2018
 * Section: CSE 154 AB
 * This web service allows the client to send information of a journal and send a name, it can save
 * and retrieve the information of the most recent journal and all the names entered.
 *
 * /items/all
 * Provides a json of the information of the current journal.
 * Example request: "/items/all"
 * Example response:
 * {
 * "dog-grooming":
 * {
 *  "id": "2",
 *  "name":"Dog Grooming Service(Small and Medium dog only)",
 *  "price":"20",
 *  "description":"Dog grooming service, will take care of your dog and make sure it looks fab.",
 *  "image":"img/dog.png"
 * },
 * "translation":
 * {
 *  "id": "3",
 *  "name":"Translation Service",
 *  "price":"12",
 *  "description":"Translation service, can translate all kinds of documents.",
 *  "image":"img/dictionary.png"
 * },
 * "..."
 * }
 *
 * /items/:id
 * Takes in an id parameter and then retrieves the JSON of the item corresponding to the given id.
 * Example response:
 * {
 *  "id": "1",
 *  "name":"Website Design Service",
 *  "price":"40",
 *  "description":"I can design website for you.",
 *  "image":"img/website.png"
 * }
 *
 * /items/filter/:low/:mid/:high
 * Takes in the range parameter and then retrieves a JSON representing all the items within the
 * given price range.
 * Example request: '/items/filter/1/0/0'
 * Example response:
 *  {
 * "translation":
 * {
 *  "id": "3",
 *  "name":"Translation Service",
 *  "price":"12",
 *  "description":"I can translate all kinds of documents.",
 *  "image":"img/dictionary.png"
 * },
 * "group-swim":
 * {
 *  "id": "4",
 *  "name":"Group Swim Lesson (30 min Up to 3 people)",
 *  "price":"10",
 *  "description":"I'll teach you to swim, you can bring a friend or not.",
 *  "image":"img/people-swimming.png"
 * },
 * "..."
 * }
 *
 * /faq
 * Retrieves an array of JSON representing all questions and answers on the database.
 * Example request: "/faq"
 * Example response:
 *  [
 * {
 * "question":"Is this a dummy question?",
 * "answer":"This is a dumb question."
 * },
 * {
 * "question":"When will the product be delivered?",
 * "answer":"On the eighth day of the week, if I'm feeling it."
 * },
 * "..."
 * ]
 *
 * /user/contact
 * Takes in a form data that contains information of the message and adds it to the database then
 * provides a plain text that indicate sending message was successful.
 * Example request: "/user/contact"
 * Example response:
 *  "Message successfully sent!"
 *
 * /user/signup
 * Takes in a form data that contains information of the new user and adds it to the database then
 * provides a plain text that indicate adding new user was successful.
 * Example request: "/user/signup"
 * Example response:
 *  "Account successfully created!"
 */

/*
 * Note to Tal: I'm not sure if the documentation on here is right, I saw the hybrids example and
 * followed a similar convention for both the documentation and the method comments.
 */

"use strict";

const express = require("express");
const app = express();
const mysql = require("promise-mysql");
const multer = require("multer");
const INVALID_REQUEST_ERROR = 400;
const SERVER_ERROR = 500;
const SERVER_ERROR_MESSAGE = "Something went on on the server, try again later.";

app.use(multer().none());
app.use(express.static("public"));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

/**
 * Establishes a database connection to the store database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDB() {
  let db = await mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "store"
  });
  return db;
}

/**
 * Sends the given query witht he optional parameters to the database to update or get information.
 * @param {String} qry - The query to get the information from the database
 * @param {String} opt - The optional parameters to get the information from the database
 * @returns {Object} - The array of objects that matches the given query and optional parameter
 */
async function queryDB(qry, opt) {
  let db;
  let row;
  try {
    db = await getDB();
    if (opt !== "") {
      row = await db.query(qry, opt);
    } else {
      row = await db.query(qry);
    }
    db.end();
    return row;
  } catch (err) {
    if (db) { // only defined if getDB() returned a successfully-connected object
      db.end();
    }
    throw err;
  }
}

/**
 * Provides an array of json of all the products' information, including the id, name, price,
 * image, alt text and deal.
 */
app.get("/items/all", async function(req, res) {
  let result;
  let qry = "SELECT id, name, price, img, alt, deal FROM products;";
  try {
    result = await queryDB(qry, "");
    res.type("json");
    res.send(result);
  } catch (err) {
    res.type("text");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
  }
});

/*
 * Takes in the id parameter find the product that matches the id, provides a JSON object\
 * containing the is, name, price, image, alt text and description of the product.
 */
app.get('/item/:id', async function(req, res) {
  let id = req.params.id;
  let result;
  let qry = "SELECT id, name, price, img, alt, description, deal FROM products WHERE id = ?;";
  try {
    let db = await getDB();
    result = await db.query(qry, [id]);
    result = result[0];
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(INVALID_REQUEST_ERROR).send("No results found.");
    } else {
      res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
    }
  }
  res.type("json");
  res.send(result);
});

/**
 * Provides an array of json of the products' information, each contains the product information of
 * those that satisfies the price constraint.
 */
app.get("/items/filter/:low/:mid/:high", async function(req, res) {
  let low = req.params.low;
  let mid = req.params.mid;
  let high = req.params.high;
  let result;
  let qry = processQry(low, mid, high);
  try {
    result = await queryDB(qry);
    res.type("json");
    res.send(result);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(INVALID_REQUEST_ERROR).send("No results found.");
    } else {
      res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
    }
  }
});

/**
 * Makes and returns a query that will be used to filter the products according to the given price
 * range constraint.
 * @param {String} low - The parameter to determine whether to include in the response products
 * in low price range.
 * @param {String} mid - The parameter to determine whether to include in the response products
 * in medium price range.
 * @param {String} high - The parameter to determine whether to include in the response products
 * in high price range.
 * @returns {String} - A query that will be used to filter the products according to the given
 * price range constraint.
 */
function processQry(low, mid, high) {
  let qry = "SELECT id, name, price, img, alt, deal FROM products WHERE";
  if (low === "1") {
    qry += " pricerange LIKE '%low%'";
  }
  if (mid === "1") {
    let arr = qry.split(" ");
    if (arr[arr.length - 1] !== "WHERE") {
      qry += " OR";
    }
    qry += " pricerange LIKE '%mid%'";
  }
  if (high === "1") {
    let arr = qry.split(" ");
    if (arr[arr.length - 1] !== "WHERE") {
      qry += " OR";
    }
    qry += " pricerange LIKE '%high%'";
  }
  return qry;
}

/**
 * Provides an array of json of the faq information, each element contains a question and the
 * associated answer.
 */
app.get("/faq", async function(req, res) {
  let result;
  let qry = "SELECT question, answer FROM qas;";
  try {
    result = await queryDB(qry);
    res.type("json");
    res.send(result);
  } catch (err) {
    res.type("text");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
  }
});

/**
 * Enters the user's contact information to the database using POST request. Sends a text message
 * indicating if the request was successfully made.
 */
app.post("/user/contact", async function(req, res) {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let text = req.body.text;
  let id = await findCustomer(email);
  let qry = "INSERT INTO contacts(firstname, lastname, email, description, customerid) " +
              "VALUES (?, ?, ?, ?, ?);";
  res.type("text");
  try {
    await queryDB(qry, [firstname, lastname, email, text, id]);
    res.send("Message successfully sent!");
  } catch (err) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
  }
});

/**
 * Enters the user's sign up information to the database using POST request. Sends a text message
 * indicating if the request was successfully made.
 */
app.post("/user/signup", async function(req, res) {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  res.type("text");
  try {
    let id = await findCustomer(email);
    if (id) {
      res.send("There's already an account associated with this email address.");
    } else {
      let qry = "INSERT INTO customers(firstname, lastname, email, username, password) " +
               "VALUES (?, ?, ?, ?, ?);";
      let input = [firstname, lastname, email, username, password];
      await queryDB(qry, input);
      res.send("Account successfully created!");
    }
  } catch (err) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
  }
});

/*
 * Note: I was originally going to use cookie to handle the add to cart functionality, but I wasn't
 * very familiar with it, so I decided to go with DOM manipulation. Below are the portion that
 * I wrote that actually worked, yet I couldn't figure out how to add multiple items and then
 * retieve the information related to those items, so I left it like this. Would you take a look?
 * Thanks!
 */

/*
 * app.post("/user/add", async function(req, res) {
 *   let item = req.body.item;
 *   let qry = "SELECT id from products;";
 *   let items;
 *   try {
 *     items = await queryDB(qry);
 *     for (let i = 0; i < items.length; i++) {
 *       let id = items[i].id;
 *       if (id === (item)) {
 *         res.type("text");
 *         res.status(INVALID_REQUEST_ERROR).send("Unable to add product.");
 *       } else {
 *         res.cookie("item", item, {expires: new Date(Date.now() + COOKIE_EXP_TIME)});
 *         res.send("successfully added to cart.");
 *       }
 *     }
 *   } catch (err) {
 *     res.type("text");
 *     res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
 *   }
 * });
 */

/**
 * Finds if there's already a user associated with the given email.
 * @param {String} email - The given email of the customer
 * @returns {Object} - if the customer is found in the database, return the id of the cutomer;
 * if not, return null.
 */
async function findCustomer(email) {
  let qry = "SELECT customerid, email from customers;";
  let result = await queryDB(qry);
  for (let i = 0; i < result.length; i++) {
    if (result[i].email === email) {
      return result[i].customerid;
    }
  }
  return null;
}

const PORT = process.env.PORT || 8000;
app.listen(PORT);
