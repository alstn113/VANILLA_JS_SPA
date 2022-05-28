function ToiletList({ $app, initialState, onClick }) {
  this.$state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "content";
  $app.appendChild(this.$target);
  this.onClick = onClick;

  this.setState = (nextState) => {
    this.$state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `${this.$state
      .map(
        (node, index) =>
          `<div data-index="${index}" class="item">${node.toiletNm} ${node.lnmadr}</div>`
      )
      .join("")}`;
  };

  this.render();
}

export default ToiletList;
