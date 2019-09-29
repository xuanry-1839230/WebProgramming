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
  window.addEventListener("load", init);

  /**
   * Adds event listeners to all the forms and buttons on the page.
   * Fetches the existing information of the current journal and adds it to the page.
   */
  function init() {
    fetch("/faq")
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(populate)
      .catch(handleError);
  }

  /**
   * Adds event listeners to all the forms and buttons on the page.
   * Fetches the existing information of the current journal and adds it to the page.
   * @param {Object} resp - something something
   */
  function populate(resp) {
    id("faq").innerHTML = "";
    for (let i = 0; i < resp.length; i++) {
      let qa = resp[i];
      let box = gen("div");
      let question = gen("p");
      question.textContent = qa.question;
      question.classList.add("question");
      let answer = gen("p");
      answer.textContent = qa.answer;
      answer.classList.add("answer");
      box.appendChild(question);
      box.appendChild(answer);
      id("faq").appendChild(box);
    }
  }

  /**
   * Handles the error in fetch requests, then displays a message on the page indicating the error.
   */
  function handleError() {
    let message = gen("p");
    message.textContent = "An error occured, please try again.";
    qs("main").appendChild(message);
    setTimeout(function() {
      qs("main").removeChild(qs("main").lastChild);
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
    return response;
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
})();
