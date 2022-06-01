const PUBLIC_DATA_END_POINT =
  "http://api.data.go.kr/openapi/tn_pubr_public_toilet_api";
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
      `${PUBLIC_DATA_END_POINT}?serviceKey=${PUBLIC_DATA_SERVICE_KEY}&type=json&numOfRows=500&pageNo=41`
    );
    console.log(response.body.items);
    return response.body.items;
  } catch (err) {
    throw new Error(`Something is wrong : ${err.message}`);
  } finally {
    finishLoading();
  }
};
