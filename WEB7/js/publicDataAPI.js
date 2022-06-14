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

const getToiletList = async ({ setLoading, finishLoading }) => {
  try {
    setLoading();
    const { response } = await request(
      "https://apis.data.go.kr/6260000/FoodService/getFoodKr?serviceKey=ZUNxLvaGCvEs%2FKT9A5PUWAsqbc7eG61kOXeXY5DnXeCxe3jyM57N5EmQqbFhqwRgR1FxF1BzQOSVnpes9xp0Cg%3D%3D&pageNo=1&numOfRows=10"
    );
    console.log(response.body.items);
    return response.body.items;
  } catch (err) {
    throw new Error(`Something is wrong : ${err.message}`);
  } finally {
    finishLoading();
  }
};
