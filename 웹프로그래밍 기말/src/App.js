import { request } from "./lib/api.js";
import { PROPERTIES } from "./config/properties.js";
import DataList from "./components/DataList.js";

function App($app) {
  this.$state = {
    data: [],
  };

  const dataList = new DataList({ $app, data: this.$state.data });

  this.setState = (nextState) => {
    this.$state = nextState;
    dataList.setState(this.$state.data);
  };

  this.init = async () => {
    try {
      const { data } = await request(
        `${PROPERTIES.PUBLIC_DATA_END_POINT}?serviceKey=${PROPERTIES.PUBLIC_DATA_SERVICE_KEY}`
      );
      console.log(data);
      this.setState({ ...this.$state, data: data });
    } catch (err) {
      throw new Error(err);
    }
  };

  this.init();
}

export default App;
