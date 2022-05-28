function ToiletDetail({ $app, initialState }) {
  this.$state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "content";
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.$state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `<div>화장실 디테일</div>`;
  };

  this.render();
}

export default ToiletDetail;
