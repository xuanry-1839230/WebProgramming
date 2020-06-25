/**
 * Name: Susan Yang
 * Date: July 28th, 2019
 * Section: CSE 154 AB
 * This is the JS file for my final project, it implements the behavior of the index.html page,
 * which allows the client to see the products in the store, filter them by price, add them to
 * cart, using the requested information from the server. Then updates the page or saves the
 * information accordingly.
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  /**
   * Adds event listeners to all buttons on the page.
   * Fetches the information of the all the current peoducts in store and populates the page.
   */
  function init() {
    let filters = qsa("#filter input");
    for (let i = 0; i < filters.length; i++) {
      filters[i].addEventListener("click", filterSelection);
    }
    id("to-cart").addEventListener("click", openCart);
    let backButtons = qsa(".back");
    for (let i = 0; i < backButtons.length; i++) {
      backButtons[i].addEventListener("click", toMain);
    }
    fetch("/items/all")
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(populate)
      .catch(handleError);
  }

  /**
   * When the page loads, populates the main page with products and their information, display
   * each product in a box with their image, name, price and deal.
   * @param {Array} resp - The response object containing an array of of JSON objects that holds
   * each products' information, including image, name, price and deal.
   */
  function populate(resp) {
    id("display").innerHTML = "";
    for (let i = 0; i < resp.length; i++) {
      let item = resp[i];
      let box = gen("figure");
      box.id = item.id;
      let img = gen("img");
      img.src = "img/" + item.img;
      img.alt = item.alt;
      let name = gen("span");
      name.textContent = item.name;
      name.classList.add("name");
      let tag = gen("span");
      tag.textContent = "Starting at $ " + item.price;
      let deal = gen("strong");
      deal.textContent = " " + item.deal;
      name.appendChild(deal);
      box.appendChild(img);
      box.appendChild(name);
      box.appendChild(tag);
      id("display").appendChild(box);
      img.addEventListener("click", openProduct);
      name.addEventListener("click", openProduct);
    }
  }

  /**
   * Adds event listeners to all the forms and buttons on the page.
   * Fetches the existing information of the current journal and adds it to the page.
   */
  function filterSelection() {
    let checkbox = qsa("input[type='checkbox']");
    let showAll = true;
    let url = "/items/filter";
    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        url += "/1";
        showAll = false;
      } else {
        url += "/0";
      }
    }
    if (showAll) {
      url = "/items/all";
    }
    fetch(url)
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(populate)
      .catch(handleError);
  }

  /**
   * Adds event listeners to all the forms and buttons on the page.
   * Fetches the existing information of the current journal and adds it to the page.
   */
  function openProduct() {
    id("add-item").addEventListener("click", addCart);
    id("main-page").classList.add("hidden");
    id("product-view").classList.remove("hidden");
    let num = this.parentNode.id;
    fetch("/item/" + num)
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(showProduct)
      .catch(handleError);
  }

  /**
   * Adds event listeners to all the forms and buttons on the page.
   * Fetches the existing information of the current journal and adds it to the page.
   * @param {Object} resp - something something
   */
  function showProduct(resp) {
    let view = qs("#product-view div");
    view.innerHTML = "";
    let img = gen("img");
    img.src = "img/" + resp.img;
    img.alt = resp.alt;
    let info = gen("div");
    info.classList.add("info");
    let name = gen("span");
    name.textContent = resp.name;
    name.classList.add("name");
    let deal = gen("strong");
    deal.textContent = " " + resp.deal;
    name.appendChild(deal);
    let tag = gen("span");
    tag.textContent = "$ " + resp.price;
    tag.classList.add("price");
    let text = gen("p");
    text.textContent = resp.description;
    view.id = resp.id;
    view.appendChild(img);
    info.appendChild(name);
    info.appendChild(tag);
    info.appendChild(text);
    view.appendChild(info);
  }

  /**
   * Handles the error in fetch requests, then displays a message on the page indicating the error.
   */
  function addCart() {
    let item = this.parentNode;
    let box = gen("div");
    let view = qs("#cart");
    let img = gen("img");
    img.src = item.querySelector("img").src;
    img.alt = item.querySelector("img").alt;

    let name = gen("span");
    name.textContent = item.querySelector(".name").textContent;
    name.classList.add("name");

    let price = gen("span");
    price.textContent = item.querySelector(".price").textContent;
    let remove = gen("button");
    remove.classList.add("remove-item");
    remove.type = "submit";
    remove.textContent = "Remove from Cart";
    let br = gen("br");

    box.appendChild(img);
    box.appendChild(name);
    box.appendChild(price);
    box.appendChild(remove);
    box.appendChild(br);
    view.appendChild(box);
    view.insertBefore(box, view.querySelector("aside"));
    let buttons = qsa(".remove-item");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", removeItem);
    }
  }

  /**
   * Handles the error in fetch requests, then displays a message on the page indicating the error.
   */
  function openCart() {
    id("main-page").classList.add("hidden");
    id("product-view").classList.add("hidden");
    id("cart").classList.remove("hidden");
  }

  /**
   * Handles the error in fetch requests, then displays a message on the page indicating the error.
   */
  function removeItem() {
    let item = this.parentNode;
    id("cart").removeChild(item);
  }

  /**
   * When the back to main button is clicked, the view switches back to the main page to product
   * display
   */
  function toMain() {
    id("main-page").classList.remove("hidden");
    id("product-view").classList.add("hidden");
    id("cart").classList.add("hidden");
  }

  /**
   * Handles the error in fetch requests, then displays a message on the page indicating the error.
   */
  function handleError() {
    let message = gen("p");
    message.textContent = "An error occured, please try again later.";
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
