import { loading_request } from "./api/api.js";
import Breadcrumb from "./components/Breadcrumb.js";
import Nodes from "./components/Nodes.js";
import Loading from "./components/Loading.js";
import ImageView from "./components/ImageView.js";

const cache = {};

function App($app) {
  this.state = {
    isRoot: false,
    nodes: [],
    depth: [],
    selectedFilePath: null,
    isLoading: false,
  };

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: this.state.depth,
    onClick: (index) => {
      if (index === null) {
        this.setState({ ...this.state, depth: [], nodes: cache.root });
        return;
      }

      if (index === this.state.depth.length - 1) {
        return;
      }

      const nextDepth = this.state.depth.slice(0, index + 1);

      this.setState({
        ...this.state,
        depth: nextDepth,
        nodes: cache[nextDepth[(nextDepth, length - 1)].id],
      });
    },
  });
  const nodes = new Nodes({
    $app,
    initialState: { isRoot: this.state.isRoot, nodes: this.state.nodes },
    onClick: async (node) => {
      try {
        if (node.type === "DIRECTORY") {
          const nextNodes = cache[node.id]
            ? cache[node.id]
            : await loading_request({
                nodeId: node.id,
                setLoading: () => {
                  this.setState({ ...this.state, isLoading: true });
                },
                finishLoading: () => {
                  this.setState({ ...this.state, isLoading: false });
                },
              });
          cache[node.id] = nextNodes;
          this.setState({
            ...this.state,
            isRoot: false,
            depth: [...this.state.depth, node],
            nodes: nextNodes,
          });
        } else if (node.type === "FILE") {
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath,
          });
        }
      } catch (err) {
        throw new Error(`무엇인가 잘못 되었습니다. ${err.message}`);
      }
    },
    onBackClick: async () => {
      try {
        const nextState = { ...this.state };
        nextState.depth.pop();

        const prevNodeId =
          nextState.depth.length === 0
            ? null
            : nextState.depth[nextState.depth.length - 1].id;

        this.setState({
          ...nextState,
          isRoot: !prevNodeId,
          nodes: prevNodeId ? cache[prevNodeId] : cache.root,
        });
      } catch (err) {
        throw new Error(`무엇인가 잘못 되었습니다. ${err.message}`);
      }
    },
  });
  const imageView = new ImageView({
    $app,
    initialState: this.state.selectedFilePath,
  });

  const loading = new Loading({ $app, initialState: this.state.isLoading });

  this.setState = (nextState) => {
    this.state = nextState;
    breadcrumb.setState(this.state.depth);
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    imageView.setState(this.state.selectedFilePath);
    loading.setState(this.state.isLoading);
  };

  this.init = async () => {
    try {
      const rootNodes = await loading_request({
        nodeId: null,
        setLoading: () => {
          this.setState({ ...this.state, isLoading: true });
        },
        finishLoading: () => {
          this.setState({ ...this.state, isLoading: false });
        },
      });
      console.log("rootNodes: ", rootNodes);
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape")
          this.setState({ ...this.state, selectedFilePath: null });
      });
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      });

      cache.root = rootNodes;
    } catch (e) {
      throw new Error(e);
    }
  };

  this.init();
}

export default App;
