let presentPosition;

// custom marker images
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

// kakao map initial setting
const mapContainer = document.getElementById("map");
const mapOption = {
  center: new kakao.maps.LatLng(35.1347632, 129.1081092),
  level: 3,
  mapTypeId: kakao.maps.MapTypeId.ROADMAP,
};

const map = new kakao.maps.Map(mapContainer, mapOption);
const mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// functions
function setPresentPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      presentPosition = new kakao.maps.LatLng(lat, lon);
      displayMarker(presentPosition, userMarkerImage, "화장실 어디있지?");
      map.panTo(presentPosition);
    });
  } else {
    presentPosition = new kakao.maps.LatLng(35.1347632, 129.1081092);
    displayMarker(
      presentPosition,
      userMarkerImage,
      "위치데이터를 받아올 수 없음"
    );
    map.panTo(presentPosition);
  }

  const moveToPresentLocation = document.getElementById(
    "moveToPresentLocation"
  );
  moveToPresentLocation.addEventListener("click", () => {
    map.panTo(presentPosition);
  });
}

function displayMarker(localPosition, markerImage, message) {
  const marker = new kakao.maps.Marker({
    position: localPosition,
    image: markerImage,
  });

  if (message) {
    const infowindow = new kakao.maps.InfoWindow({
      position: localPosition,
      content: `<div class="infowindow">${message}</div>`,
    });

    infowindow.open(map, marker);
  }

  marker.setMap(map);
}

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

    displayMarker(toiletLocation, toiletMarkerImage, null);

    const toilet = document.createElement("p");
    toilet.className = "item";
    toilet.innerHTML = `${data.toiletNm}`;
    toilet.addEventListener("click", () => {
      map.panTo(toiletLocation);
      displaySelectedToilet(data);
    });
    toiletListElement.appendChild(toilet);
  });
}

function displaySelectedToilet(selectedToilet) {
  const element = document.getElementById("toiletDetail");
  element.innerHTML = `
    <div class="item">
      <div>화장실명</div>
      <div>${selectedToilet.toiletNm}</div>
    </div>
    <div class="item">
      <div>도로명주소</div>
      <div>${selectedToilet.rdnmadr}</div>
    </div>
    <div class="item">전화번호 : ${selectedToilet.phoneNumber}</div>
    <div class="item">개방시간 : ${selectedToilet.openTime}</div>
    <div class="item">남성용 - 대변기수 : ${selectedToilet.menToiletBowlNumber}개</div>
    <div class="item">남성용 - 소변기수 : ${selectedToilet.menUrineNumber}개</div>
    <div class="item">여성용 - 대변기수 : ${selectedToilet.ladiesToiletBowlNumber}개</div>
  `;
}

// main function
function main() {
  displayData();
  setPresentPosition();
}

// start main function
main();
