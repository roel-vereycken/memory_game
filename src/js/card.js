export default class Card {
  constructor(holder, icon, color = "white") {
    this._holder = document.getElementById(holder);
    this._icon = icon;
    this._color = color;
    this._flippedEvent = new CustomEvent("flipped", { detail: this });
    this._htmlRef = this.init();
    this._isFlipped = false;
    this.setUpEvents();
    this.setColor();
  }
  setColor() {
    this._htmlRef.style.color = this._color;
  }
  init() {
    this._holder.insertAdjacentHTML(
      "beforeend",
      `
              <div class="flip-card">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <p>Memory</p>
                  </div>
                  <div class="flip-card-back">
                    <svg class='icon icon-pencil'>
                      <use xlink:href='./../icons/symbol-defs.svg#icon-${this._icon}'></use>
                    </svg>
                  </div>
                </div>
              </div>
          `
    );
    return this._holder.querySelector(".flip-card:last-child");
  }
  setUpEvents() {
    this._htmlRef.onclick = this.flip;
  }
  flip = () => {
    if (this._isFlipped) {
      this._isFlipped = false;
    } else {
      this._htmlRef.classList.add("turn");
      this._isFlipped = true;
      dispatchEvent(this._flippedEvent);
    }
  };
}
