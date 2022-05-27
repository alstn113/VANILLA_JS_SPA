import { PROPERTIES } from "../config/properties.js";

function ImageView({ $app, initialState }) {
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "Modal ImageView";

  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `
      <div class="content">
        ${
          this.state
            ? `<img src="${PROPERTIES.IMAGE_PATH_PREFIX}${this.state}"/>`
            : ""
        }
      </div>
    `;

    this.$target.style.display = this.state ? "block" : "none";
  };

  this.render();
}

export default ImageView;
