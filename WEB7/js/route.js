let polyline;
let endMarker;

async function displayRoute(start, end) {
  if (polyline != null) {
    polyline.setMap(null);
  }
  if (endMarker != null) {
    endMarker.setMap(null);
  }

  endMarker = new kakao.maps.Marker({
    map: map,
    position: end,
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
  polyline = new kakao.maps.Polyline({
    endArrow: true,
    path: linePath,
    strokeWeight: 10,
    strokeColor: "red",
    strokeOpacity: 0.8,
    strokeStyle: "solid",
  });

  polyline.setMap(map);

  return "도보 : " + tDistance + "km, " + tTime + "분";
}
