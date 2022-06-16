let presentPosition;
let dataList;

// custom marker images
const CustomMarkerImage = new kakao.maps.MarkerImage(
  "images/marker/yellow.png",
  new kakao.maps.Size(30, 40),
  new kakao.maps.Point(15, 40)
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
      displayMarker(presentPosition, userMarkerImage, null);
      map.panTo(presentPosition);

      const dataListElement = document.getElementById("dataList");
      dataListElement.innerHTML = "";
      dataList = sortDataListByDistance(presentPosition, dataList);
      dataList?.forEach((data) => {
        const dataLocation = new kakao.maps.LatLng(data.LAT, data.LNG);
        const item = document.createElement("p");
        item.className = "item";
        item.innerHTML = `${data.MAIN_TITLE}`;
        item.addEventListener("click", () => {
          map.panTo(dataLocation);
          displaySelectedData(data);
        });
        dataListElement.appendChild(item);
      });
    });
  } else {
    presentPosition = new kakao.maps.LatLng(35.1347632, 129.1081092);
    displayMarker(presentPosition, userMarkerImage, null);
    map.panTo(presentPosition);
  }

  const moveToPresentLocation = document.getElementById(
    "moveToPresentLocation"
  );
  moveToPresentLocation.addEventListener("click", () => {
    map.panTo(presentPosition);
  });
}

function displayMarker(localPosition, markerImage, data) {
  const marker = new kakao.maps.Marker({
    position: localPosition,
    image: markerImage,
  });

  if (data) {
    const content = `
      <div class="wrap">
        <div class="info">
          <div class="title">${data.MAIN_TITLE}</div>
          <div class="body">
            <div class="img">
              <img src="${data.MAIN_IMG_THUMB}" width="73" height="70" />
            </div>
            <div class="desc">
              <div class="ellipsis">🏠도로명 주소</div>
              <div class="ellipsis">${data.ADDR1}</div>
              <div class="ellipsis">🍴메인 메뉴</div>
              <div class="ellipsis">${
                data.RPRSNTV_MENU || "표시되지 않음"
              }</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const customOverlay = new kakao.maps.CustomOverlay({
      position: localPosition,
      content: content,
    });

    kakao.maps.event.addListener(marker, "mouseover", () => {
      customOverlay.setMap(map);
    });
    kakao.maps.event.addListener(marker, "mouseout", () => {
      customOverlay.setMap(null);
    });
    kakao.maps.event.addListener(marker, "click", () => {
      displaySelectedData(data);
    });
  }
  marker.setMap(map);
}

async function displayData() {
  const dataListElement = document.getElementById("dataList");
  dataList = await getDataList({
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

    displayMarker(dataLocation, CustomMarkerImage, data);

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
      <div>${selectedData.RPRSNTV_MENU || "표시되지 않음"}</div>
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
