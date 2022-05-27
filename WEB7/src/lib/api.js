export const request = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("서버의 상태가 이상합니다!");
    return await res.json();
  } catch (err) {
    throw new Error(`무엇인가 잘못 되었습니다. ${err.message}`);
  }
};
