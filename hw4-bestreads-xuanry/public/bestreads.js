/**
 * Name: Susan Yang
 * Date: Aug 16th, 2019
 * Section: CSE 154 AB
 * This is the JS file for my homework 4, it implements the behavior of the bestreards.html page.
 * It allows the view many books at a time, or open one book and view thetitle, author, description,
 * and reviews of that specific book.
 */

"use strict";
(function() {
  const API_URL = "/bestreads";

  window.addEventListener("load", init);

  /**
   *  Adds event listner to home button. Populates the view with all the books.
   */
  function init() {
    id("home").addEventListener("click", goHome);
    populate();
  }

  /**
   * Populates the view with all the books by using a fetch request and then populates the page
   * with the book's cover and title.
   */
  function populate() {
    fetch(API_URL + "/books")
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(allBooks)
      .catch(handleError);
  }

  /**
   * Displays all the books, including their covers and titles using the given response object
   * @param {object} resp - JSON object that contains a list of book names and their folder
   * names, given back by the fetch request that fetches information of all the books.
   */
  function allBooks(resp) {
    id("home").disabled = true;
    let bookBox = id("all-books");
    bookBox.innerHTML = "";
    if (resp["books"].length === 0) {
      handleError();
    } else {
      id("book-data").classList.remove("hidden");
      bookBox.classList.remove("hidden");
      id("single-book").classList.add("hidden");
      id("error-text").classList.add("hidden");
      for (let i = 0; i < resp["books"].length; i++) {
        let div = document.createElement("div");
        div.id = resp["books"][i]["folder"];
        div.classList.add("selectable");
        let img = document.createElement("img");
        img.src = "covers/hobbit.jpg";
        img.src = "covers/" + resp["books"][i]["folder"] + ".jpg";
        div.appendChild(img);
        let title = document.createElement("p");
        title.textContent = resp["books"][i]["title"];
        div.appendChild(title);
        bookBox.appendChild(div);
        div.addEventListener("click", singleBook);
      }
    }
  }

  /**
   * When a book is click on the main page, the view with all books is hidden, the use a fetch
   * request to get and display this book's info and reviews.
   */
  function singleBook() {
    id("all-books").classList.add("hidden");
    id("single-book").classList.remove("hidden");
    id("book-cover").src = this.querySelector("img").src;
    id("home").disabled = false;

    fetch(API_URL + "/description/" + this.id)
      .then(checkStatus)
      .then(getDescription)
      .catch(handleError);
    fetch(API_URL + "/info/" + this.id)
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(getInfo)
      .catch(handleError);
    fetch(API_URL + "/reviews/" + this.id)
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(getReviews)
      .catch(handleError);
  }

  /**
   * When a the Home button is clicked on a single book view, the view with all books is shown,
   * and the home button is disabled again.
   */
  function goHome() {
    populate();
    id("home").disabled = true;
  }

  /**
   * Displays the title and author of the book using the given JSON response
   * @param {JSON} resp - the JSON response objext containing information of the title and the
   * author
   */
  function getInfo(resp) {
    id("book-title").textContent = resp["title"];
    id("book-author").textContent = resp["author"];
  }

  /**
   * Displays the description of the book using the given JSON response
   * @param {JSON} resp - the JSON response objext containing information of the description
   */
  function getDescription(resp) {
    id("book-description").textContent = resp;
  }

  /**
   * Displays the reviews of the book using the given JSON response
   * @param {JSON} resp - the JSON response objext containing information of the reviewers, ratings,
   * and review texts
   */
  function getReviews(resp) {
    let reviews = id("book-reviews");
    reviews.innerHTML = "";
    let total = 0;
    for (let i = 0; i < resp.length; i++) {
      total += parseFloat(resp[i]["rating"]);
      let reviewer = document.createElement("h3");
      let rating = document.createElement("h4");
      let text = document.createElement("p");
      reviewer.textContent = resp[i]["name"];
      let fixedRate = parseFloat(resp[i]["rating"]).toFixed(1);
      rating.textContent = "Rating: " + fixedRate;
      text.textContent = resp[i]["text"];
      reviews.appendChild(reviewer);
      reviews.appendChild(rating);
      reviews.appendChild(text);
    }
    let avg = total / resp.length;
    id("book-rating").textContent = avg.toFixed(1);
  }

  /**
   * Handles the error in fetch requests, then displays a message on the page indicating the error.
   */
  function handleError() {
    id("error-text").classList.remove("hidden");
    id("book-data").classList.add("hidden");
    id("single-book").classList.add("hidden");
    id("all-books").classList.add("hidden");
    id("home").disabled = true;
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response; // a Response object
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }
})();
