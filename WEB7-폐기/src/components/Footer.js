function Footer({ $app }) {
  this.$target = document.createElement("footer");
  this.$target.innerHTML = "Footer";
  $app.appendChild(this.$target);

  this.setState = () => {
    this.render();
  };

  this.render = () => {};

  this.render();
}

export default Footer;
