function Header({ $app }) {
  this.$target = document.createElement("header");
  this.$target.innerHTML = "전국공중화장실";
  $app.appendChild(this.$target);

  this.setState = () => {
    this.render();
  };

  this.render = () => {};

  this.render();
}

export default Header;
