let presentPosition;

// custom marker images
const CustomMarkerImage = new kakao.maps.MarkerImage(
  "images/marker/restaurant.png",
  new kakao.maps.Size(20, 20),
  new kakao.maps.Point(10, 20)
);

const userMarkerImage = new kakao.maps.MarkerImage(
  "images/marker/user.png",
  new kakao.maps.Size(30, 40),
  new kakao.maps.Point(15, 40)
);

// kakao map initial setting
const mapContainer = document.getElementById("map");
const mapOption = {
  center: new kakao.maps.LatLng(35.1347632, 129.1081092),
  level: 5,
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
      displayMarker(presentPosition, userMarkerImage, "배고파! 맛집알려줘");
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
  const dataListElement = document.getElementById("dataList");
  let dataList = await getDataList({
    setLoading: () => {
      dataListElement.classList.add("loading");
    },
    finishLoading: () => {
      dataListElement.classList.remove("loading");
    },
  });
  dataList = sortDataListByDistance(presentPosition, dataList);

  dataList.forEach((data) => {
    const dataLocation = new kakao.maps.LatLng(data.LAT, data.LNG);

    displayMarker(dataLocation, CustomMarkerImage, null);

    const item = document.createElement("p");
    item.className = "item";
    item.innerHTML = `${data.MAIN_TITLE}`;
    item.addEventListener("click", () => {
      map.panTo(dataLocation);
      displaySelectedData(data);
    });
    dataListElement.appendChild(item);
  });
}

async function displaySelectedData(selectedData) {
  const destination = new kakao.maps.LatLng(selectedData.LAT, selectedData.LNG);
  const pedestrian_time = await displayPedestrianRoute(
    presentPosition,
    destination
  );
  const cart_time = await displayCarRoute(presentPosition, destination);
  const element = document.getElementById("dataDetail");
  element.innerHTML = `
    <div class="item">
      <img src=${selectedData.MAIN_IMG_THUMB} alt=""/>
    </div>
    <div class="item">
      <div>식당이름 : ${selectedData.MAIN_TITLE}</div>
    </div>
    <div class="item">
      <div>도로명주소</div>
      <div>${selectedData.ADDR1}</div>
    </div>
    <div class="item">전화번호 : ${selectedData.CNTCT_TEL}</div>
    <div class="item">개방시간 : ${selectedData.USAGE_DAY_WEEK_AND_TIME}</div>
    <div class="item"><i class="fa-solid fa-circle" style="color:red;"></i> ${pedestrian_time}</div>
    <div class="item"><i class="fa-solid fa-circle" style="color:blue;"></i> ${cart_time}</div>
    <div class="item">
      <div>메인 메뉴</div>
      <div>${selectedData.RPRSNTV_MENU}</div>
    </div>
    <div class="item">
      <div>설명</div>
      <div>${selectedData.ITEMCNTNTS}</div>
    </div>
  `;
}

// main function
function main() {
  displayData();
  setPresentPosition();
}

// start main function
main();
