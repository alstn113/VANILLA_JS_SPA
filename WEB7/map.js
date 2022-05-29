let presentPosition;

const mapContainer = document.getElementById("map");
const mapOption = {
  center: new kakao.maps.LatLng(35.1347632, 129.1081092),
  level: 1,
};

const map = new kakao.maps.Map(mapContainer, mapOption);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    presentPosition = new kakao.maps.LatLng(lat, lon);
    const message = '<div style="padding:5px;">여기에 계신가요?!</div>';
    displayMarker(presentPosition, message);
  });
} else {
  presentPosition = new kakao.maps.LatLng(35.1347632, 129.1081092);
  const message = "geolocation을 사용할 수 없어요.";
  displayMarker(presentPosition, message);
}

displayData();

const displayMarker = (locPosition, message) => {
  const marker = new kakao.maps.Marker({
    map: map,
    position: locPosition,
  });

  const iwContent = message;
  const iwRemovable = true;

  const infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemovable,
  });

  infowindow.open(map, marker);

  map.setCenter(locPosition);
};

async function displayData() {
  const toiletListData = await getToiletList();
  const toiletListElement = document.getElementById("toiletList");
  toiletListData.forEach((data) => {
    const toilet = document.createElement("p");
    toilet.className = "item";
    toilet.innerHTML = `${data.toiletNm}`;
    toiletListElement.appendChild(toilet);
  });
}

const moveToPresentLodation = document.getElementById("moveToPresentLodation");
moveToPresentLodation.addEventListener("click", () => {
  map.panTo(presentPosition);
});
