/**
 * Name: Susan Yang
 * Date: July 26th, 2019
 * Section: CSE 154 AB
 * This is the JS file for Homework 3, it implements the behaviors of the pokedex page; it displays
 * all pokemons, then allows the user to repeatedly select pokemons and battle game with another
 * pokemon using the pokemon selected.
 */

"use strict";
(function() {
  const BASE_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
  const STARTER = ["charmander", "bulbasaur", "squirtle"];
  const WEEK_THRESH = 0.2;
  let guid = "";
  let pid = "";
  let fullHp = 0;

  window.addEventListener("load", init);

  /**
   * When the page loads, fetch the pokedex of each pokemon and populate the pokedex view
   */
  function init() {
    let request = BASE_URL + "pokedex.php?pokedex=all";
    fetch(request)
      .then(checkStatus)
      .then((resp) => resp.text())
      .then(populate)
      .catch(console.error);
    id("start-btn").addEventListener("click", startGame);
    id("flee-btn").addEventListener("click", makeMove);
    id("endgame").addEventListener("click", goBack);
  }

  /**
   * populates the pokedex view by fetching their sprites from the web, displays the found pokemon
   * sprites, displays found pokemons as colored and others as black; then adds event listeners to
   * the found pokemons.
   * @param {object} resp - the response JSON object given back by the fetch request to fetch all
   * pokemon's sprites
   */
  function populate(resp) {
    let view = id("pokedex-view");
    let pokedex = resp.split("\n");
    for (let i = 0; i < pokedex.length; i++) {
      let name = pokedex[i].split(":")[1];
      let img = gen("img");
      img.src = BASE_URL + "sprites/" + name + ".png";
      img.alt = name;
      img.id = name;
      img.classList.add("sprite");
      if (name === STARTER[0] || name === STARTER[1] || name === STARTER[2]) {
        img.classList.add("found");
      }
      img.addEventListener("click", clickPoke);
      view.appendChild(img);
    }
  }

  /**
   * When a found pokemon is clicked, fetch its information from the web for display.
   */
  function clickPoke() {
    if (this.classList.contains("found")) {
      id("start-btn").classList.remove("hidden");
      qs("#p1 .name").id = this.alt;
      let request = BASE_URL + "pokedex.php?pokemon=" + this.alt;
      fetch(request)
        .then(checkStatus)
        .then((resp) => resp.json())
        .then((resp) => makeCard(resp, "#p1"))
        .catch(console.error);
    }
  }

  /**
   * Fetch the given pokemon's information from the web and displays it in the poke card.
   * @param {object} resp - the response JSON object given back by the fetch request that fetches
   * all information about a pokemon
   * @param {object} player - the player associated with the given information
   */
  function makeCard(resp, player) {
    if (player === "#p1") {
      fullHp = resp["hp"];
    }
    qs(player + " .type").src = BASE_URL + resp["images"]["typeIcon"];
    qs(player + " .hp").innerText = resp["hp"] + "HP";
    qs(player + " .name").innerText = resp["name"];
    qs(player + " .pokepic").src = BASE_URL + resp["images"]["photo"];
    qs(player + " .info").innerText = resp["info"]["description"];
    let buttons = qsa(player + " .moves button");
    for (let i = 0; i < buttons.length; i++) {
      if (resp["moves"][i] !== undefined) {
        if (player === "#p1") {
          buttons[i].addEventListener("click", makeMove);
        }
        buttons[i].classList.remove("hidden");
        buttons[i].querySelector("img").src = BASE_URL + "icons/" + resp["moves"][i]["type"] +
        ".jpg";
        buttons[i].querySelector(".move").textContent = resp["moves"][i]["name"];
        if (resp["moves"][i]["dp"] !== undefined) {
          buttons[i].querySelector(".dp").textContent = resp["moves"][i]["dp"] + " DP";
        } else {
          buttons[i].querySelector(".dp").textContent = "";
        }
      } else {
        buttons[i].classList.add("hidden");
      }
    }
    qs(player + " .weakness").src = BASE_URL + resp["images"]["weaknessIcon"];
  }

  /**
   * When a pokemon is chosen, the pokemon battle will start, the view and content of the page will
   * change to pokemon battle view accordingly, a request is sent to the server to get information
   * about the p2's pokemon, then makes a similar card for p2's pokemon;
   */
  function startGame() {
    qs("h1").textContent = "Pokemon Battle Mode!";
    let data = new FormData();
    data.append("startgame", "true");
    data.append("mypokemon", qs("#p1 .name").id);
    fetch(BASE_URL + "game.php", {method: "POST", body: data})
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(function(resp) {
        guid = resp["guid"];
        pid = resp["pid"];
        makeCard(resp["p2"], "#p2");
      })
      .catch(console.error);

    id("pokedex-view").classList.add("hidden");
    id("p2").classList.remove("hidden");
    qs("#p1 .hp-info").classList.remove("hidden");
    id("flee-btn").classList.remove("hidden");
    id("start-btn").classList.add("hidden");
    qs("#p1 .buffs").classList.remove("hidden");
    let moves = qsa("#p1 button");
    for (let i = 0; i < moves.length; i++) {
      moves[i].disabled = false;
    }
    id("results-container").classList.remove("hidden");
    id("p1-turn-results").classList.remove("hidden");
    id("p2-turn-results").classList.remove("hidden");
    qs("#p1 .buffs").classList.remove("hidden");
    qs("#p2 .buffs").classList.remove("hidden");
  }

  /**
   * In the battle, p1's pokemon makes a move when a move is clicked, the page changes accordingly,
   * a request is sent to the server to get information about the result of this move, the results
   * are then used to update the page;
   */
  function makeMove() {
    id("p1-turn-results").innerText = "";
    id("p2-turn-results").innerText = "";
    id("loading").classList.remove("hidden");
    let data = new FormData();
    data.append("guid", guid);
    data.append("pid", pid);
    if (this.id === "flee-btn") {
      data.append("movename", "flee");
    } else {
      data.append("movename", this.querySelector("span").textContent);
    }
    fetch(BASE_URL + "game.php", {method: "POST", body: data})
      .then(checkStatus)
      .then((resp) => resp.json())
      .then(displayAttack)
      .catch(console.error);
  }

  /**
   * Use the response information to display the result of this attack on the page using the
   * given response. If the game has ended
   * (one pokemon dies), update the page and buttons accordingly.
   * @param {object} resp - the response JSON object given back by the fetch request to fetch
   * information about the result of p1's move.
   */
  function displayAttack(resp) {
    id("loading").classList.add("hidden");
    qs("#p1 .hp").innerText = resp["p1"]["current-hp"] + "HP";
    qs("#p2 .hp").innerText = resp["p2"]["current-hp"] + "HP";
    attackResult("p1", resp);
    attackResult("p2", resp);

    if (resp["p1"]["current-hp"] === 0 || resp["p2"]["current-hp"] === 0) {
      let heading = qs("h1");
      if (resp["p1"]["current-hp"] === 0) { // p1 is dead
        heading.textContent = "You lost!";
      } else {
        id(resp["p2"]["shortname"]).classList.add("found");
        heading.textContent = "You win!";
      }
      let buttons = qsa("#p1 .card button");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
      id("flee-btn").classList.add("hidden");
      id("endgame").classList.remove("hidden");
    }
  }

  /**
   * Use the response information to display the result of this attack, update the health bar,
   * buff result and the message.
   * @param {object} player - the player associated with the given information
   * @param {object} resp - the response JSON object given back by the fetch request that fetches
   * information about a single attack in the game
   */
  function attackResult(player, resp) {
    let healthRemain = resp[player]["current-hp"] / resp[player]["hp"];
    qs("#" + player + " .health-bar").style.width = (healthRemain * 100) + "%";
    if (healthRemain <= WEEK_THRESH) {
      qs("#" + player + " .health-bar").classList.add("low-health");
    }
    buffResult(player, resp);
    if (player === "p1" || (resp["results"][player + "-move"] !== null &&
        resp[player]["current-hp"] !== 0)) {
      let playerNum = player[1];
      id(player + "-turn-results").innerText = "Player " + playerNum + " played " +
        resp["results"][player + "-move"] + " and " + resp["results"][player + "-result"] + "!";
    } else {
      id(player + "-turn-results").innerText = "";
    }
  }

  /**
   * Use the response information to update the buff and debuff icon of the battling pokemons.
   * @param {object} player - the player associated with the given information
   * @param {object} resp - the response JSON object given back by the fetch request that fetches
   * information about a single attack in the game
   */
  function buffResult(player, resp) {
    let buffs = qs("#" + player + " .buffs");
    buffs.innerHTML = "";
    if (resp["buffs"] !== null) {
      for (let i = 0; i < resp[player]["buffs"].length; i++) {
        let newBuff = gen("div");
        newBuff.classList.add("buff");
        newBuff.classList.add(resp[player]["buffs"][i]);
        buffs.appendChild(newBuff);
      }
    }

    if (resp["debuffs"] !== null) {
      for (let i = 0; i < resp[player]["debuffs"].length; i++) {
        let newDebuff = document.createElement("div");
        newDebuff.classList.add("debuff");
        newDebuff.classList.add(resp[player]["debuffs"][i]);
        buffs.appendChild(newDebuff);
      }
    }
  }

  /**
   * When the game has ended and the "Back to Pokedex" button is clicked, end the battle and go
   * back, update the page accordingly. If the user has won the battle, p2's pokemon should now be
   * found and displayed accordingly.
   */
  function goBack() {
    qs("h1").textContent = "Your Pokedex";
    id("pokedex-view").classList.remove("hidden");
    id("results-container").classList.add("hidden");
    id("p2").classList.add("hidden");
    id("endgame").classList.add("hidden");
    id("start-btn").classList.remove("hidden");
    qs("#p1 .buffs").classList.remove("hidden");
    qs("#p2 .buffs").classList.remove("hidden");
    qs("#p1 .buffs").innerHTML = "";
    qs("#p2 .buffs").innerHTML = "";
    id("p1-turn-results").innerText = "";
    id("p2-turn-results").innerText = "";
    qs("#p1 .hp-info").classList.add("hidden");
    let healthbars = qsa(".health-bar");
    for (let i = 0; i < healthbars.length; i++) {
      healthbars[i].style.width = "100%";
      healthbars[i].classList.remove("low-health");
    }
    qs("#p1 .hp").innerText = fullHp + "HP";
  }

  /* ------------------------------ Helper Functions  ------------------------------ */

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
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
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
