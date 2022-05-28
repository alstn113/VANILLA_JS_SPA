/*global kakao */
function KakaoMap({ $app }) {
  const { kakao } = window;
  console.log(kakao);
  this.$target = document.createElement("div");
  this.$target.id = "map";
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 5,
  };

  new kakao.maps.Map(this.$target, options);
  $app.appendChild(this.$target);
  this.setState = () => {
    this.render();
  };

  this.render = () => {};

  this.render();
}

export default KakaoMap;
