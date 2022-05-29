const PUBLIC_DATA_END_POINT =
  "http://api.data.go.kr/openapi/tn_pubr_public_toilet_api";
const PUBLIC_DATA_SERVICE_KEY =
  "ZUNxLvaGCvEs%2FKT9A5PUWAsqbc7eG61kOXeXY5DnXeCxe3jyM57N5EmQqbFhqwRgR1FxF1BzQOSVnpes9xp0Cg%3D%3D";

const request = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("서버의 상태가 이상합니다!");
    return await res.json();
  } catch (err) {
    throw new Error(`무엇인가 잘못 되었습니다. ${err.message}`);
  }
};

const getToiletList = async () => {
  const { response } = await request(
    `${PUBLIC_DATA_END_POINT}?serviceKey=${PUBLIC_DATA_SERVICE_KEY}&type=json`
  );
  console.log(response.body.items);
  return response.body.items;
};
