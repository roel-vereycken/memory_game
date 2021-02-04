import Card from "./card";
import randomColor from "randomColor";

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

export default class Memory {
  constructor(lvl = 1, username = "Memory Master") {
    this._allIcons = [];
    this._lvl = lvl;
    this._htmlRef = null;
    this._title = null;
    this._selected = null;
    this._doubled = null;
    this._cardsInGame = null;
    this._selectedColor = [];
    this._checkIcons = [];
    this._checkObjects = [];
    this._gameArr = [];
    this.fetchIcons();
    this._username = username;
  }

  fetchIcons() {
    fetch("./../../icons/selection.json")
      .then((response) => response.json())
      .then((data) => {
        this._allIcons = data.icons.map((el) => el.properties.name);
        this.init();
      })
      .catch((error) => console.log(error));
  }
  init() {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
    <h2 id = "title"> Username: ${this._username} / lvl: ${this._lvl} </h2>
    `
    );
    document.getElementById("game").insertAdjacentHTML(
      "afterbegin",
      `
      <div id = "memory">
      </div>
    `
    );
    this._title = document.getElementById("title");
    this._htmlRef = document.getElementById("memory");
    if (this._lvl > 3) {
      this._htmlRef.style.width = "75%";
    } else if (this._lvl > 5) {
      this._htmlRef.style.width = "100%";
    }
    this.startLevel();
  }
  startLevel() {
    const randomNm = getRandomInt(0, 450);
    shuffle(this._allIcons);
    this._selected = this._allIcons.slice(randomNm, randomNm + this._lvl * 2);
    this._selected.map((el) => this._selectedColor.push([el, randomColor()]));
    this._doubled = [...this._selectedColor, ...this._selectedColor];
    shuffle(this._doubled);
    this._doubled.map((el) => new Card("memory", el[0], el[1]));
    this._cardsInGame = this._doubled.length;
    this.setUpEvents();
  }
  setUpEvents() {
    window.addEventListener("flipped", (e) => {
      e.detail._htmlRef.style.pointerEvents = "none";
      this._checkIcons.push(e.detail._icon);
      this._checkObjects.push(e.detail);
      if (
        this._checkIcons.length == 2 &&
        this._checkIcons[0] == this._checkIcons[1]
      ) {
        console.log("match");
        this._gameArr.push(this._checkIcons);
        this._checkIcons = [];
        this._checkObjects.map((el) => (el._htmlRef.style.color = "grey"));
        this._checkObjects = [];
        this.endGame();
      } else if (
        this._checkIcons.length == 2 &&
        this._checkIcons[0] !== this._checkIcons[1]
      ) {
        const allCards = document.querySelectorAll("div.flip-card");
        allCards.forEach((el) => (el.style.pointerEvents = "none"));
        console.log("no match");
        setTimeout(() => {
          this._checkObjects[0]._htmlRef.classList.remove("turn");
          this._checkObjects[0]._isFlipped = false;
          this._checkObjects[0]._htmlRef.style.pointerEvents = "";
          this._checkObjects[1]._htmlRef.classList.remove("turn");
          this._checkObjects[1]._isFlipped = false;
          this._checkObjects[1]._htmlRef.style.pointerEvents = "";
          allCards.forEach((el) => (el.style.pointerEvents = ""));
          this._checkIcons = [];
          this._checkObjects = [];
        }, 1200);
      }
    });
  }
  endGame() {
    if (this._cardsInGame === this._gameArr.length * 2) {
      console.log("proficiat");
      setTimeout(() => {
        this._htmlRef.remove();
        this._title.remove();
      }, 2000);
      setTimeout(() => {
        this._lvl++;
        this._htmlRef = null;
        this._selected = null;
        this._doubled = null;
        this._cardsInGame = null;
        this._selectedColor = [];
        this._checkIcons = [];
        this._checkObjects = [];
        this._gameArr = [];
        this.setUpEvents = undefined;
        this.init();
      }, 3000);
    }
  }
}
