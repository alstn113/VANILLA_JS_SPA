import { request } from "./api/api.js";
import { PROPERTIES } from "./config/properties.js";
import Header from "./components/Header.js";
import ToiletList from "./components/ToiletList.js";
import ToiletDetail from "./components/ToiletDetail.js";
import KakaoMap from "./components/KakaoMap.js";
import Footer from "./components/Footer.js";

function App($app) {
  this.$state = {
    toiletList: [],
    selectedToilet: null,
  };

  const header = new Header({ $app });
  const toiletList = new ToiletList({
    $app,
    initialState: this.$state.toiletList,
    onClick: () => {},
  });
  const toiletDetail = new ToiletDetail({
    $app,
    initialState: this.$state.selectedToilet,
  });
  const kakaoMap = new KakaoMap({ $app });
  const footer = new Footer({ $app });

  this.setState = (nextState) => {
    this.$state = nextState;
    header.setState();
    toiletList.setState(this.$state.toiletList);
    toiletDetail.setState(this.$state.selectedToilet);
    kakaoMap.setState();
    footer.setState();
  };

  this.init = async () => {
    try {
      const { response } = await request(
        `${PROPERTIES.PUBLIC_DATA_END_POINT}?serviceKey=${PROPERTIES.PUBLIC_DATA_SERVICE_KEY}&type=json`
      );
      console.log(response);
      this.setState({ ...this.$state, toiletList: response.body.items });
    } catch (err) {
      throw new Error(err);
    }
  };

  this.init();
}

export default App;
