// Using Heroku Server to solve Cors Error
const HEROKU_SERVER_END_POINT = "https://public-data-cors.herokuapp.com";
const PUBLIC_DATA_END_POINT =
  "http://apis.data.go.kr/6260000/FoodService/getFoodKr";
const PUBLIC_DATA_SERVICE_KEY =
  "ZUNxLvaGCvEs%2FKT9A5PUWAsqbc7eG61kOXeXY5DnXeCxe3jyM57N5EmQqbFhqwRgR1FxF1BzQOSVnpes9xp0Cg%3D%3D";
const request = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Internal Server Error");
    return await res.json();
  } catch (err) {
    throw new Error(`Something is wrong : ${err.message}`);
  }
};

const getDataList = async ({ setLoading, finishLoading }) => {
  try {
    setLoading();
    const response = await request(
      `${HEROKU_SERVER_END_POINT}/${PUBLIC_DATA_END_POINT}?serviceKey=${PUBLIC_DATA_SERVICE_KEY}&numOfRows=200&resultType=json`
    );
    console.log(response.getFoodKr.item);
    return response.getFoodKr.item;
  } catch (err) {
    throw new Error(`Something is wrong : ${err.message}`);
  } finally {
    finishLoading();
  }
};
