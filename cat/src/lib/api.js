const API_END_POINT =
  "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

const request = async (nodeId) => {
  try {
    const res = await fetch(`${API_END_POINT}/${nodeId ? nodeId : ""}`);
    if (!res.ok) throw new Error("서버의 상태가 이상합니다!");
    return await res.json();
  } catch (err) {
    throw new Error(`무엇인가 잘못 되었습니다. ${err.message}`);
  }
};

export const loading_request = async ({
  nodeId,
  setLoading,
  finishLoading,
}) => {
  try {
    setLoading();
    const nodes = await request(nodeId);
    return nodes;
  } catch (err) {
    throw new Error(`무엇인가 잘못 되었습니다. ${err.message}`);
  } finally {
    finishLoading();
  }
};
