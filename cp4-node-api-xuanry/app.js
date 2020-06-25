/*
 * Name: Susan Yang
 * Date: July 27th, 2018
 * Section: CSE 154 AB
 * This web service allows the client to send information of a journal and send a name, it can save
 * and retrieve the information of the most recent journal and all the names entered.
 *
 * /journal
 * Provides a json of the information of the current journal.
 * Example request: "/journal"
 * Example response:
 *  {"date":"2018-03-07",
 *    "title":"Hello",
 *    "text":"Hello world."}
 *
 * /names
 * Provides a plain text list of all names previously inputted to the page.
 * Example response:
 *  Foo
 *  Bar
 *  Susan
 *  Chris
 *  Mowgli
 *
 * /journal/:data
 * Takes in the data parameter and makes a new journal replacing the current journal, then provides
 * the json of the new journal.
 * Example request: '/journal/{"date":"2018-03-07","title":"Hello","text":"Hello world"}'
 * Example response:
 *  {"date":"2018-03-07",
 *    "title":"Hello",
 *    "text":"hello world"}
 *
 * /name/:name
 * Takes in the name parameter and adds it to the current log of names, then provides a plain text
 * that indicate adding name was successful.
 * Example request: "name/toby"
 * Example response:
 *  Successfully added name!
 */

/*
 * Note to Tal: I'm not sure if the documentation on here is right, I saw the hybrids example and
 * followed a similar convention for both the documentation and the method comments.
 */

"use strict";

const express = require("express");
const app = express();
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

app.use(express.static("public"));

const INVALID_REQUEST_ERROR = 400;
const FILE_ERROR = 500;

/**
 * Provides a json of the information of the current journal, including date, title and text by
 * getting the information from the data.txt file.
 */
app.get("/journal", async function(req, res) {
  let journals;
  try {
    journals = await readFile("public/data/data.json", "utf8");
  } catch (err) {
    res.type("text");
    res.status(FILE_ERROR).send("Something went wrong fetching the data");
  }
  let result = journals;
  res.type("json");
  res.send(result);
});

/**
 * Provides a plain text list of all names previously entered to the page by getting the
 * list of names from the name.txt file.
 */
app.get("/names", async function(req, res) {
  let names;
  try {
    names = await readFile("public/data/names.txt", "utf8");
  } catch (err) {
    res.type("text");
    res.status(FILE_ERROR).send("Something went wrong fetching the data" + err);
  }
  res.type("text");
  res.send(names);
});

/*
 * Takes in the name parameter and adds it to the current log of names in the names.txt file, then
 * provides a plain text that indicates adding name was succssful.
 */
app.get('/name/:name', async function(req, res) {
  let name = req.params.name;
  try {
    let contents = await readFile("public/data/names.txt", "utf8");
    contents += name + "\n";
    await writeFile("public/data/names.txt", contents, "utf8");
  } catch (error) {
    res.status(FILE_ERROR).send("Something went wrong writing the data");
  }
  res.type("text");
  res.send("Successfully added name!");
});

/*
 * Takes in the data parameter and makes a new journal replacing the current journal in the
 * data.txt file, then sends the json of the new journal.
 */
app.get('/journal/:data', async function(req, res) {
  let data = req.params.data;
  let newData = {};
  newData = JSON.parse(data);
  let message;
  if (newData["date"] === undefined || newData["title"] === undefined ||
  newData["text"] === undefined) {
    res.type("text");
    message = "The request is invalid, make sure input request contains date, title and text";
    res.status(INVALID_REQUEST_ERROR).send(message);
  }
  try {
    await writeFile("public/data/data.json", JSON.stringify(newData), "utf8");
  } catch (error) {
    res.type("text");
    message = "Something went wrong writing the data to file";
    res.status(FILE_ERROR).send(message);
  }
  res.type("json");
  res.send(newData);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
