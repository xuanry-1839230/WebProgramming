/**
    * Name: Susan Yang
    * Date: June 28th, 2019
    * Section: CSE 154 AB
    * This is the JS file implement the UI for my portfolio page, it allows the user to save images
    * from the portfolio and see their saved images.
*/

"use strict";
(function() {
  window.addEventListener("load", init);

  /**
    *  Sets initial event listeners for all buttons
  */
  function init() {
    let saveBtn = qsa(".save-btn");
    for (let i = 0; i < saveBtn.length; i++) {
      saveBtn[i].addEventListener("click", saveImg);
    }
    let toggle = qsa("aside button");
    for (let j = 0; j < toggle.length; j++) {
      toggle[j].addEventListener("click", toggleView);
    }
  }

  /**
    * Saves the image user selects to the saved images page to be displayed in saved images view
  */
  function saveImg() {
    let grouping = this.parentNode;
    let image = grouping.firstElementChild;
    let save = document.createElement("img");
    save.src = image.src;
    save.alt = image.alt;
    save.classList.add(grouping.classList[1]);
    id("saved").appendChild(save);
  }

  /**
    * Changes the page view between the portfolio page and save images page
  */
  function toggleView() {
    id("portfolio-view").classList.toggle("hidden");
    id("saved-view").classList.toggle("hidden");
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
  */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

})();
