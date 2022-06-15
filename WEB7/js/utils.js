function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistance(user_lat, user_lng, destination_lat, destination_lng) {
  const R = 6371;
  const dLat = deg2rad(destination_lat - user_lat);
  const dLon = deg2rad(destination_lng - user_lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(user_lat)) *
      Math.cos(deg2rad(destination_lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function sortDataListByDistance(presentPosition, dataList) {
  if (presentPosition == null) {
    return dataList;
  }
  const user_lat = presentPosition.getLat();
  const user_lng = presentPosition.getLng();

  dataList.sort((a, b) => {
    return (
      getDistance(user_lat, user_lng, a.LAT, a.LNG) -
      getDistance(user_lat, user_lng, b.LAT, b.LNG)
    );
  });
  return dataList;
}
