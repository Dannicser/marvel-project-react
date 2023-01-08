import "./charInfo.scss";
import { Component } from "react/cjs/react.production.min";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

class CharInfo extends Component {
  state = {
    charList: null,
    download: false,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount = () => {
    this.updateChar(); // пиши отдельный метод в сервисах
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.idChar !== prevProps.idChar) {
      this.updateChar(prevProps);
    }
  };

  updateChar = () => {
    const { idChar } = this.props;

    if (!idChar) {
      return;
    }
    MarvelService.getOneCharForInfo(idChar)
      .then(this.onCharLoad)
      .catch(this.onError);
    this.onCharLoading();
  };

  onCharLoad = (char) => {
    this.setState({
      charList: char,
      download: false,
    });
  };

  onCharloaded = (charList) => {
    this.setState({
      charList,
      download: false,
    });
  };

  onCharLoading = () => {
    return this.setState({ download: true });
  };

  onError = () => {
    this.setState({
      download: false,
      error: true,
    });
  };

  render() {
    const { download, charList, error } = this.state;

    //
    const skeleton = charList || download ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const load = download ? <Spinner /> : null;
    const content = !(download || !charList) ? (
      <View charList={charList} />
    ) : null;
    return (
      <div className="char__info">
        {errorMessage}
        {!error ? skeleton : null}
        {load}
        {content}
      </div>
    );
  }
}

const View = ({ charList }) => {
  const { name, description, comics } = charList;

  return (
    <>
      <div className="char__basics">
        <img
          src={
            charList.thumbnail.path + ".jpg" ===
            "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
              ? "https://img1.goodfon.ru/wallpaper/nbig/e/c1/marvel-studio-marvel-studiya.jpg"
              : charList.thumbnail.path + ".jpg"
          }
          alt={name}
        />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={charList.urls[0].url} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={charList.urls[1].url} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {description === ""
          ? "This Char doesn't have description"
          : charList.description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        <Comics comics={comics} />
      </ul>
    </>
  );
};

const Comics = (props) => {
  const { comics } = props;

  if (comics.items.length < 1) {
    return <li>This Char doesn't have a comics</li>;
  }

  return comics.items.map((el, index) => {
    // пофикси баг с изображением !!!
    if (index < 10) {
      // если будет очень много элементов упадет производительность (условие будет проверяться для всех элементов), необходимо использовать цикл и выходить через break
      return (
        <li key={index} className="char__comics-item">
          {el.name}
        </li>
      );
    }
  });
};

export default CharInfo;
