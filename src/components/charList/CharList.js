import "./charList.scss";
import Spinner from "../spinner/Spinner";
import { Component } from "react/cjs/react.production.min";
import MarvelService from "../../services/MarvelService";

class CharList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charList: [],
      download: true,
      offset: 210,
      newItemLoad: false,
    };
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.setState({ newItemLoad: true });
    this.marvelService.getAllCharacters(offset).then(this.onCharListLoaded);
  };

  onCharListLoaded = (data) => {
    this.setState(({ charList, offset }) => ({
      charList: [...charList, ...data],
      download: false,
      offset: offset + 9,
      newItemLoad: false,
    }));
  };

  renderItems(array) {
    return array.map((el, index) => {
      return (
        <li
          onClick={() => this.props.onCharSelected(el.id)}
          key={array.id}
          className="char__item"
        >
          <img src={el.thumpnail} alt={el.name} />
          <div className="char__name">{el.name}</div>
        </li>
      );
    });
  }

  render() {
    const { charList, download, offset, newItemLoad } = this.state;

    const items = this.renderItems(charList);

    const spinners = [<Spinner />, <Spinner />, <Spinner />];

    const load = download ? spinners : null;
    const content = !load ? items : null;

    return (
      <div className="char__list">
        <ul className="char__grid">
          {content}
          {load}
        </ul>
        <button
          style={{ display: newItemLoad ? "none" : null }}
          disabled={newItemLoad}
          onClick={() => this.onRequest(offset)}
          className="button button__main button__long"
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
