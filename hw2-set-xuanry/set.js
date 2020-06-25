"use strict";
(function() {
  const STYLE = ["solid", "outline", "striped"];
  const COLOR = ["green", "purple", "red"];
  const SHAPE = ["diamond", "oval", "squiggle"];
  let secondsRemaining = 0;
  let timerId = null;
  let totalCards = 0;
  window.addEventListener("load", init);

  /**
   * Adds event listeners to elements on the main page.
   */
  function init() {
    id("start-btn").addEventListener("click", startGame);
    id("back-btn").addEventListener("click", toMain);
    id("refresh-btn").addEventListener("click", refresh);
  }

  /**
   * Starts the game whent he start button is clicked, modifies the view of the page, the cards,
   * buttons, and timer for the starting of the game.
   */
  function startGame() {
    let isEasy = false;
    id("refresh-btn").disabled = false;
    if (qs("#menu-view input").checked === true) {
      isEasy = true;
      totalCards = 9;
    } else {
      totalCards = 12;
    }
    let game = id("board");
    for (let i = 0; i < totalCards; i++) {
      game.appendChild(generateUniqueCard(isEasy));
    }
    startTimer();
    toggleView();
  }

  /**
   * Generate and returns an array of random attributes of a card
   * @param {int} isEasy The boolean representing if the Easy mode is selected.
   * @returns {Array} returns an array of random attributes of a card, in the form of
   * [style, shape, color, count]
   */
  function generateRandomAttributes(isEasy) {
    let shape = SHAPE[genRand()];
    let color = COLOR[genRand()];
    let count = genRand() + 1;
    let style = null;
    if (isEasy) {
      style = STYLE[0];
    } else {
      style = STYLE[genRand()];
    }
    return [style, shape, color, count];
  }

  /**
   * Returns a random integer between 0 and 2 (inclusive)
   * @returns {int} a random integer between 0 and 2(inclusive)
   */
  function genRand() {
    return Math.floor(Math.random() * 3);
  }

  /**
   * Given the difficulty level of the game, generates and returns one new unique card
   * @param {int} isEasy The boolean representing if the Easy mode is selected.
   * @returns {object} a div that represent the new card generated.
   */
  function generateUniqueCard(isEasy) {
    let cardId = "";
    let div = gen("div");
    let fileName = "";
    let style = [];
    do {
      style = generateRandomAttributes(isEasy);
      fileName = style[0] + "-" + style[1] + "-" + style[2];
      cardId = fileName + "-" + style[3];
    } while (id(cardId) !== null);

    div.id = cardId;
    let img = gen("img");
    img.src = "img/" + fileName + ".png";
    for (let j = 0; j < style[3]; j++) {
      let element = gen("img");
      element.alt = cardId;
      element.src = "img/" + fileName + ".png";
      div.appendChild(element);
    }

    div.addEventListener("click", cardSelected);
    div.classList.add("card");
    return div;
  }

  /**
   * Starts the timer on the page and displays the countdown
   */
  function startTimer() {
    let timeSelector = qs("#menu-view select");
    secondsRemaining = parseInt(timeSelector.value);
    showTime();
    timerId = setInterval(function() {
      secondsRemaining--;
      advanceTimer(secondsRemaining, timerId);
    }, 1000);
  }

  /**
   * After the timer has started, and displays the countdown
   */
  function showTime() {
    let timer = id("time");

    let minutes = Math.floor(secondsRemaining / 60);
    let seconds = secondsRemaining % 60;
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    timer.textContent = minutes + ":" + seconds;
  }

  /**
   * After the timer has started, advance the timer, displays the countdown; when there is no more
   * game time remaining, stop the game and clear the timer.
   */
  function advanceTimer() {
    if (secondsRemaining > 0) {
      showTime();
    } else {
      secondsRemaining = 0;
      showTime();
      id("refresh-btn").disabled = true;
      clearInterval(timerId);
      timerId = null;
      let cards = qsa(".card");
      for (let i = 0; i < cards.length; i++) {
        cards[i].removeEventListener("click", cardSelected);
      }
    }
  }

  /**
   * Keep track of the cards selected; once there are three cards, deternine if they form a set,
   * display the message and continues the game acording to the result.
   */
  function cardSelected() {
    this.classList.toggle("selected");
    let selected = qsa(".selected");

    if (selected.length === 3) {
      let set = false;
      if (isASet(selected)) {
        set = true;
        displayResult("SET!", selected, set);
        let originalCount = id("set-count").textContent;
        id("set-count").textContent = parseInt(originalCount) + 1;
      } else {
        displayResult("Not a Set :(", selected, set);
        secondsRemaining = secondsRemaining - 15;
        if (secondsRemaining < 0) {
          secondsRemaining = 0;
        }
        showTime();
      }
      for (let i = 0; i < selected.length; i++) {
        selected[i].classList.remove("selected");
      }
    }
  }

  /**
   * Display if the cards selected form a set, display the message; if they form a set, replace
   * them with 3 new cards, if not, clears message and continue game.
   * @param {String} text The text to be displayed in the card boxes
   * @param {Array} selected The selected array of cards
   * @param {boolean} set whether the set is a set
   */
  function displayResult(text, selected, set) {
    for (let i = 0; i < selected.length; i++) {
      selected[i].classList.add("hide-imgs");
      let box = gen("p");
      box.textContent = text;
      selected[i].appendChild(box);
    }
    setTimeout(function() {
      if (!set) {
        for (let i = 0; i < selected.length; i++) {
          selected[i].classList.remove("hide-imgs");
          selected[i].lastElementChild.remove();
        }
      } else {
        let isEasy = false;
        if (totalCards === 9) {
          isEasy = true;
        }
        for (let i = 0; i < selected.length; i++) {
          let oldCardDiv = id(selected[i].id);
          let newCardDiv = generateUniqueCard(isEasy);
          oldCardDiv.replaceWith(newCardDiv);
        }
      }
    }, 1000);
  }

  /**
   * When "Refresh Board" button is clicked, refreshes the page and replace all cards with newly
   * generated random cards.
   */
  function refresh() {
    let isEasy = false;
    if (totalCards === 9) {
      isEasy = true;
    }
    let game = id("board");
    game.innerHTML = "";
    for (let i = 0; i < totalCards; i++) {
      game.appendChild(generateUniqueCard(isEasy));
    }
  }

  /**
   * When "Back to Main" button is clicked, clear the game progress of the current game, and go
   * back to the main page.
   */
  function toMain() {
    toggleView();
    clearInterval(timerId);
    id("menu-view").classList.remove("hidden");
    id("game-view").classList.add("hidden");
    id("board").innerHTML = "";
    id("set-count").textContent = "0";
  }

  /**
   * Toggle between the game view and the menu view.
   */
  function toggleView() {
    id("game-view").classList.toggle("hidden");
    id("menu-view").classList.toggle("hidden");
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - List of all selected cards to check if a set.
   * @return {boolean} True if valid set false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let allSame = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      let allDiff = attributes[0][i] !== attributes[1][i] &&
                    attributes[1][i] !== attributes[2][i] &&
                    attributes[0][i] !== attributes[2][i];
      if (!(allDiff || allSame)) {
        return false;
      }
    }
    return true;
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
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object} - The first DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Returns a newly generated DOM element of the given type.
   * @param {string} query - HTML element type.
   * @returns {array} - The new generated DOM element of the given type.
   */
  function gen(query) {
    return document.createElement(query);
  }

})();
