let presentPosition;

const mapContainer = document.getElementById("map");
const mapOption = {
  center: new kakao.maps.LatLng(37.566826, 126.9786567),
  level: 1,
};

const map = new kakao.maps.Map(mapContainer, mapOption);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    presentPosition = new kakao.maps.LatLng(lat, lon);

    map.setCenter(presentPosition);
  });
} else {
  presentPosition = new kakao.maps.LatLng(37.566826, 126.9786567);
  alert("현재 위치를 찾을 수 없습니다!");
}
