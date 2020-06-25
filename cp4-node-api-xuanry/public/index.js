/**
 * Name: Susan Yang
 * Date: July 28th, 2019
 * Section: CSE 154 AB
 * This is the JS file for my creative project 4, it implements the behavior of the index.html page.
 * It allows the user to enter information on the date, title, and text of a journal, as well as
 * their names. Then sends the information to the server and updates the page or saves the
 * information accordingly.
 */

"use strict";
(function() {
  const ALL_URL = "/journal";

  window.addEventListener("load", init);

  /**
   * Adds event listeners to all the forms and buttons on the page.
   * Fetches the existing information of the current journal and adds it to the page.
   */
  function init() {
    id("journal").addEventListener("submit", function(event) {
      event.preventDefault();
      newJournal();
    });
    id("author").addEventListener("submit", function(event) {
      event.preventDefault();
      addName();
    });
    id("get-names").addEventListener("click", function(event) {
      event.preventDefault();
      getNames();
    });
    fetch(ALL_URL)
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(update)
      .catch(handleError);
  }

  /**
   * Updates the information in the journal box, including date, title and text, using the response
   * from the fetch request that gets the information of the current journal.
   * @param {object} resp - the response JSON object given back by the fetch request that fetches
   * information about the current journal.
   */
  function update(resp) {
    qs("main h3").textContent = resp["title"];
    qs("main span").textContent = resp["date"];
    qs("main p").textContent = resp["text"];
  }

  /**
   * When the "post" button is clicked, a new journal is generated; user input is taken and sent
   * to the server. After the server has successfully received the information, update the page
   * so it has the current information, which is the most recent journal.
   */
  function newJournal() {
    let date = qs("input[name = 'date']").value.toLowerCase();
    let title = qs("input[name = 'title']").value;
    let text = qs("textarea").value;

    let data = {};
    data["date"] = date;
    data["title"] = title;
    data["text"] = text;

    fetch(ALL_URL + "/" + JSON.stringify(data))
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(update)
      .catch(handleError);
  }

  /**
   * When the "Submit name" button is clicked, user input for the name is sent to the server.
   * After the server has successfully received the information, the page displays a message
   * indicating successful response.
   */
  function addName() {
    let name = qs("input[name = 'name']").value;
    name = name.substring(0, 1).toUpperCase() + name.substring(1);

    fetch("/name/" + (name))
      .then(checkStatus)
      .then((resp) => resp.text())
      .then(function() {
        let message = gen("p");
        message.textContent = "Name successfully added";
        qsa("form")[1].appendChild(message);
        setTimeout(function() {
          qsa("form")[1].removeChild(qsa("form")[1].lastChild);
        }, 2000);
      })
      .catch(handleError);
  }

  /**
   * When the button "See who's been here" is clicked, fetches the list of all the names
   * previously entered and displays them by updating the page with the response from the fetch
   * request that fetches all the previous names.
   */
  function getNames() {
    fetch("/names")
      .then(checkStatus)
      .then((resp) => resp.text())
      .then((resp) => {
        let names = gen("p");
        names.textContent = resp;
        qsa("form")[1].appendChild(names);

        setTimeout(function() {
          qsa("form")[1].removeChild(qsa("form")[1].lastChild);
        }, 5000);
      })
      .catch(handleError);
  }

  /**
   * Handles the error in fetch requests, then displays a message on the page indicating the error.
   */
  function handleError() {
    let message = gen("p");
    message.textContent = "An error occured, please try again.";
    qs("form").appendChild(message);
    setTimeout(function() {
      qs("form").removeChild(qs("form").lastChild);
    }, 2000);
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

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns all the elements in the DOM that match the given selector.
   * @param {string} querySelector - The selector to search with
   * @returns {HTMLElement[]} All elements in the DOM that match that selector
   */
  function qsa(querySelector) {
    return document.querySelectorAll(querySelector);
  }
})();
