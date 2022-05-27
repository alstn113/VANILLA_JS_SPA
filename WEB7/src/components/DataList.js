function DataList({ $app, data }) {
  this.$state = data;
  this.$target = document.createElement("div");
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.$state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `${this.$state
      .map(
        (node) =>
          `<div data-index="${node.id}">${node.address} ${node.centerName}</div>`
      )
      .join("")}`;
  };
}

export default DataList;
