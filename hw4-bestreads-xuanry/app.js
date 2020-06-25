/*
 * Name: Susan Yang
 * Date: Aug 16th, 2019
 * Section: CSE 154 AB
 * This web service allows the client retrieve all book's cover and title, and the specific
 * information of a single book. such as descrption, info and reviewsß
 *
 * This end point takes in the name parameter and returns a plain text of the description of the
 * book.
 * /bestreads/description/:name
 * Provides plain text of the description of the book with the given name.
 * Example request: "/bestreads/description/harrypotter"
 * Example response:
 *  Harry Potter is lucky to reach the age of thirteen, since he has already survived
 *  the murderous attacks of the feared Dark Lord on more than one occasion. But his
 *  hopes for a quiet term concentrating on Quidditch are dashed when a maniacal
 *  mass-murderer escapes from Azkaban, pursued by the soul-sucking Dementors who
 *  guard the prison. It's assumed that Hogwarts is the safest place for Harry to
 *  be. But is it a coincidence that he can feel eyes watching him in the dark,
 *  and should he be taking Professor Trelawney's ghoulish predictions seriously?
 *
 * This end point takes in the name parameter and returns a json objects containing
 * the author and title of the book.
 * /bestreads/info/:name
 * Provides a JSON of the name and author of the book.
 * Example request: "/bestreads/info/harrypotter"
 * Example response:
 *  {
 *    "title": "Harry Potter and the Prisoner of Azkaban (Harry Potter #3)",
 *    "author": "by J.K. Rowling, Mary GrandPre (Illustrator)",
 * }
 *
 * This end point takes in the name parameter and returns an array of json objects containing
 * the reviews.
 * /bestreads/reviews/:name
 * Provides an array of json objects containing the reviewers, the reviews and the comments.
 * Example request: "/bestreads/reviews/harrypotter"
 * Example response:
 *  [
 *    {
 *        "name": "Wil Wheaton",
 *        "rating": 4.1,
 *        "text": "I'm beginning to wonder if there will ever be a Defense Against The Dark Arts
 *                 teacher who is just a teacher."
 *    },
 *    {
 *        "name": "Zoe",
 *        "rating": 4.8,
 *        "text": "Yup yup yup I love this book"
 *    },
 *    {
 *        "name": "Kiki",
 *        "rating": 5,
 *        "text": "Literally one of the best books I've ever read. I was chained to it for two days.
 *                I cried and laughed and yelled AHH when all of the action went down."
 *    }
 *  ]
 *
 * This end point returns all the book's titles and cover images paths.
 * /bestreads/books
 * Provides the title text and cover images for all the books.
 * Example request: "/bestreads/books"
 * Example response:
 *  {
 *    "books": [
 *        {
 *          "title": "2001: A Space Odyssey",
 *          "folder": "2001spaceodyssey"
 *        },
 *        {
 *          "title": "Alanna: The First Adventure (Song of the Lioness #1)",
 *          "folder": "alannathefirstadventure"
 *        },
 *        {
 *          "title": "Alice in Wonderland",
 *          "folder": "aliceinwonderland"
 *        }
 *    ]
 * }
 */

"use strict";

const express = require("express");
const app = express();
const util = require("util");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const globPromise = util.promisify(glob);
const readFile = util.promisify(fs.readFile);

app.use(express.static("public"));

const INVALID_REQUEST_ERROR = 400;
const SERVER_ERROR = 500;
const SERVER_ERROR_MESSAGE = "Something went on on the server, try again later.";

/**
 * This end point returns all the book's titles and cover images paths.
 */
app.get("/bestreads/books", async function(req, res) {
  let data = {};
  let books = [];
  try {
    let dir = await globPromise("books/*/info.txt");
    for (let i = 0; i < dir.length; i++) {
      let file = await readFile(dir[i], "utf8");
      let title = file.split('\n')[0];
      let folder = path.dirname(dir[i]).split("/")[1];
      let bookInfo = {"title": title, "folder": folder};
      books.push(bookInfo);
    }
    data["books"] = books;
  } catch (error) {
    res.type("text");
    res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
  }
  res.type("json");
  res.send(data);
});

/*
 * This end point takes in the name parameter and returns a plain text of the description of the book.
 */
app.get('/bestreads/description/:name', async function(req, res) {
  res.type("text");
  let name = req.params.name;
  let description;
  try {
    description = await readFile("books/" + name + "/description.txt", "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(INVALID_REQUEST_ERROR).send("No results found for " + name + ".");
    } else {
      res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
    }
  }
  res.type("text");
  res.send(description);
});

/*
 * This end point takes in the name parameter and returns a json objects containing
 * the author and title of the book.
 */
app.get('/bestreads/info/:name', async function(req, res) {
  let name = req.params.name;
  let data = {};
  try {
    let file = await readFile("books/" + name + "/info.txt", "utf8");
    let arr = file.split('\n');
    let title = arr[0];
    let author = arr[1];
    data = {"title": title, "author": author};
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(INVALID_REQUEST_ERROR).send("No results found for " + name + ".");
    } else {
      res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
    }
  }
  res.type("json");
  res.send(data);
});

/*
 * This end point takes in the name parameter and returns an array of json objects containing
 * the reviews.
 */
app.get('/bestreads/reviews/:name', async function(req, res) {
  let name = req.params.name;
  let data = [];
  try {
    let dir = await globPromise("books/" + name + "/review*.txt");
    for (let i = 0; i < dir.length; i++) {
      let num = i + 1;
      let file = await readFile("books/" + name + "/review" + num + ".txt", "utf8");
      let arr = file.split('\n');
      let fileData = {"name": arr[0], "rating": arr[1], "text": arr[2]};
      data.push(fileData);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(INVALID_REQUEST_ERROR).send("No results found for " + name + ".");
    } else {
      res.status(SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
    }
  }
  res.type("json");
  res.send(data);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
