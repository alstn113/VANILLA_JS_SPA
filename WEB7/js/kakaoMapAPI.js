let presentPosition;
let selectedToilet;

// ### custom marker images ###
const toiletMarkerImage = new kakao.maps.MarkerImage(
  "images/marker/toilet.png",
  new kakao.maps.Size(40, 40),
  new kakao.maps.Point(20, 40)
);

const userMarkerImage = new kakao.maps.MarkerImage(
  "images/marker/user.png",
  new kakao.maps.Size(40, 40),
  new kakao.maps.Point(20, 40)
);

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
    const message = '<div class="info-window">급하다 급해!~</div>';
    displayMarker(presentPosition, message);
  });
} else {
  presentPosition = new kakao.maps.LatLng(35.1347632, 129.1081092);
  const message = "geolocation을 사용할 수 없어요.";
  displayMarker(presentPosition, message);
}

const displayMarker = (localPosition, message) => {
  const marker = new kakao.maps.Marker({
    position: localPosition,
    image: userMarkerImage,
  });

  const iwContent = message;
  const iwRemovable = true;

  const infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemovable,
  });

  marker.setMap(map);

  infowindow.open(map, marker);

  map.setCenter(localPosition);
};

async function displayData() {
  const toiletListElement = document.getElementById("toiletList");
  const toiletListData = await getToiletList({
    setLoading: () => {
      toiletListElement.classList.add("loading");
    },
    finishLoading: () => {
      toiletListElement.classList.remove("loading");
    },
  });
  toiletListData.forEach((data) => {
    const toiletLocation = new kakao.maps.LatLng(data.latitude, data.longitude);

    const marker = new kakao.maps.Marker({
      position: toiletLocation,
      image: toiletMarkerImage,
    });
    marker.setMap(map);

    const toilet = document.createElement("p");
    toilet.className = "item";
    toilet.innerHTML = `${data.toiletNm}`;
    toilet.addEventListener("click", () => {
      map.panTo(toiletLocation);
      selectedToilet = data;
      displaySelectedToilet();
    });
    toiletListElement.appendChild(toilet);
  });
}

function displaySelectedToilet() {
  const element = document.getElementById("toiletDetail");
  element.innerHTML = `
    <div>${selectedToilet.toiletNm}</div>
    <div>${selectedToilet.lnmadr}</div>
    <div>${selectedToilet.insttCode}</div>
    <div>${selectedToilet.rdnmadr}</div>
    <div>${selectedToilet.openTime}</div>
    <div>${selectedToilet.phoneNmber}</div>
    <div>${selectedToilet.latitude}</div>
    <div>${selectedToilet.longitude}</div>
  `;
}

const moveToPresentLocation = document.getElementById("moveToPresentLocation");
moveToPresentLocation.addEventListener("click", () => {
  map.panTo(presentPosition);
});

// 메인 함수
function main() {
  displayData();
}

//메인 함수 실행
main();
