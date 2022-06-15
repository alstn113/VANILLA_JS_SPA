let pedestrian_polyline;
let pedestrian_endMarker;

let car_polyline;

const destinationMarkerImage = new kakao.maps.MarkerImage(
  "images/marker/selMarker.gif",
  new kakao.maps.Size(80, 80),
  new kakao.maps.Point(40, 80)
);

async function displayPedestrianRoute(start, end) {
  if (pedestrian_polyline != null) {
    pedestrian_polyline.setMap(null);
  }
  if (pedestrian_endMarker != null) {
    pedestrian_endMarker.setMap(null);
  }

  pedestrian_endMarker = new kakao.maps.Marker({
    map: map,
    position: end,
    image: destinationMarkerImage,
  });

  const request = JSON.stringify({
    startX: start.getLng(),
    startY: start.getLat(),
    endX: end.getLng(),
    endY: end.getLat(),
    reqCoordType: "WGS84GEO",
    resCoordType: "WGS84GEO",
    startName: "출발지",
    endName: "도착지",
  });
  const res = await fetch(
    "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appKey: "l7xx4ad3a3606a834059a126ac7918909a35",
      },
      body: request,
    }
  );
  const response = await res.json();
  const linePath = [];
  const features = response.features;
  const tDistance = (features[0].properties.totalDistance / 1000).toFixed(2);
  const tTime = (features[0].properties.totalTime / 60).toFixed(0);

  for (let i in features) {
    const geometry = features[i].geometry;
    if (geometry.type == "LineString") {
      for (let j in geometry.coordinates) {
        const latLng = new kakao.maps.LatLng(
          geometry.coordinates[j][1],
          geometry.coordinates[j][0]
        );
        linePath.push(latLng);
      }
    }
  }
  pedestrian_polyline = new kakao.maps.Polyline({
    endArrow: true,
    path: linePath,
    strokeWeight: 5,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeStyle: "dashed",
    zIndex: 2,
  });

  pedestrian_polyline.setMap(map);

  return "도보 : " + tDistance + "km, " + tTime + "분";
}

async function displayCarRoute(start, end) {
  if (car_polyline != null) {
    car_polyline.setMap(null);
  }

  const request = JSON.stringify({
    startX: start.getLng(),
    startY: start.getLat(),
    endX: end.getLng(),
    endY: end.getLat(),
    reqCoordType: "WGS84GEO",
    resCoordType: "WGS84GEO",
    startName: "출발지",
    endName: "도착지",
  });
  const res = await fetch(
    "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appKey: "l7xx4ad3a3606a834059a126ac7918909a35",
      },
      body: request,
    }
  );
  const response = await res.json();
  const linePath = [];
  const features = response.features;
  const tDistance = (features[0].properties.totalDistance / 1000).toFixed(2);
  const tTime = (features[0].properties.totalTime / 60).toFixed(0);

  for (let i in features) {
    const geometry = features[i].geometry;
    if (geometry.type == "LineString") {
      for (let j in geometry.coordinates) {
        const latLng = new kakao.maps.LatLng(
          geometry.coordinates[j][1],
          geometry.coordinates[j][0]
        );
        linePath.push(latLng);
      }
    }
  }
  car_polyline = new kakao.maps.Polyline({
    endArrow: true,
    path: linePath,
    strokeWeight: 7,
    strokeColor: "blue",
    strokeOpacity: 0.8,
    strokeStyle: "solid",
    zIndex: 1,
  });

  car_polyline.setMap(map);

  return "자동차 : " + tDistance + "km, " + tTime + "분";
}
