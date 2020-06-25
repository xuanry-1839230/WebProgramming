/**
 * Name: Susan Yang
 * Date: July 28th, 2019
 * Section: CSE 154 AB
 * This is the JS file for my creative project 3, it implements the behavior of the index.html page.
 * It allows the user to enter the breed names of dogs, then fetchs an image of that breed from the
 * web and adds it to the page.
 */

"use strict";
(function() {
  const BASE_URL = "https://dog.ceo/api/";
  let breedsList = new Set();
  let rand = true;

  window.addEventListener("load", init);

  /**
   * Fetchs an initial random dog picture to add to the page, then add event listener to the button
   * on the main page that gets a new dog picture, also making sure the input for breed must not be
   * empty.
   */
  function init() {
    fetch(BASE_URL + "breeds/list/all")
      .then(checkStatus)
      .then(resp => resp.json())
      .then(function(resp) {
        breedsList = makeList(resp, false);
      })
      .catch(console.error);

    fetchDoggo("", "");
    id("get-doggo").addEventListener("click", function(event) {
      if (qs("input[name = 'breedName']").value !== "") {
        getDoggo();
        event.preventDefault();
      }
    });
  }

  /**
   * Generates and adds a new image to the page using the given response object with the dog image
   * @param {object} resp - response containing the dog image object, for generating and adding a
   * new image onto the page
   * @param {String} name - The breed (and subbreed) of the dog
   */
  function displayResult(resp, name) {
    let img = gen("img");
    img.src = resp.message;
    img.alt = name;
    qs("div").appendChild(img);
  }

  /**
   * Makes a list of all the breeds(or subbreeds) and stores them to the breedsList using the given
   * response object that contains the list of breeds
   * @param {object} resp - response to make a list of all the breeds
   * @param {boolean} isBreed - whether the response is expected to be of a specific breed
   * @return {Set} a set representing all the breeds(or subbreeds) in the given response
   */
  function makeList(resp, isBreed) {
    let result = new Set();
    let list = resp["message"];
    if (isBreed) {
      for (let i = 0; i < list.length; i++) {
        result.add(list[i]);
      }
    } else {
      for (let item in list) {
        result.add(item);
      }
    }
    return result;
  }

  /**
   * When the button is clicked and the breed entered is not found, displays an alert message on
   * the page
   * @param {object} str - The message to be displayed on the page
   */
  function alertMessage(str) {
    let message = gen("p");
    message.textContent = str;
    qs("form").appendChild(message);
  }

  /**
   * When the button is clicked, a new dog picture is generated comparing user inputs to the list
   * of breeds and subbreeds on the web; if the given breed doesn't exist, display a message and
   * generate a random dog picture; if the breed exist but the subbreed doesn't, generate a random
   * picture of that breed family; if both breed and subbreed input exist, generate a picture with
   * accordancance to that input.
   */
  function getDoggo() {
    let breed = qs("input[name = 'breedName']").value.toLowerCase();
    let subbreed = qs("input[name = 'subName']").value.toLowerCase();

    if (breedsList.has(breed)) { // breed exists
      rand = false;
      if (subbreed === "") { // subbreed is empty
        fetchDoggo(breed, "");
      } else { // subbreed not empty, check if subbreed exists
        let subBreedList = new Set();
        fetch(BASE_URL + "breed/" + breed + "/list")
          .then(checkStatus)
          .then(resp => resp.json())
          .then(function(resp) {
            subBreedList = makeList(resp, true);
            if (!subBreedList.has(subbreed)) {
              subbreed = "";
            }
            fetchDoggo(breed, subbreed);
          })
          .catch(console.error);
      }
    } else {
      alertMessage("Breed not found, generating a random doggo picture..");
      setTimeout(function() {
        qs("form").removeChild(qs("form").lastChild);
      }, 2000);
      rand = true;
      fetchDoggo("", "");
    }
  }

  /**
   * Helper function that fetches a picture from the web to be displayed on the page using the
   * given breed and subbreed information
   * @param {object} breed - the given breed information
   * @param {object} subbreed - the given subbreed information
   */
  function fetchDoggo(breed, subbreed) {
    let request = "";
    let text = "";
    if (rand) {
      request = BASE_URL + "breeds/image/random";
      fetch(request)
        .then(checkStatus)
        .then(resp => resp.json())
        .then(function(resp) {
          displayResult(resp, resp["message"].split("/")[4]);
        })
        .catch(console.error);
    } else {
      if (subbreed === "") { // only breed name
        request = BASE_URL + "breed/" + breed + "/images/random";
        text = breed;
      } else {
        request = BASE_URL + "breed/" + breed + "/" + subbreed + "/images/random";
        text = subbreed + " " + breed;
      }
      fetch(request)
        .then(checkStatus)
        .then(resp => resp.json())
        .then(resp => displayResult(resp, text))
        .catch(console.error);
    }
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
})();
