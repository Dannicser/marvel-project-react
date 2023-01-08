class MarvelService {
  _apiBASE = "https://gateway.marvel.com:443/v1/public";
  _apiKey = "2186c9114a049e3c138331fa149dbec5";
  _baseOffset = "210";

  async getResource(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  static getOneCharForInfo(id) {
    return fetch(
      `https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=2186c9114a049e3c138331fa149dbec5`
    )
      .then((response) => response.json())
      .then((data) => data.data.results[0]);
  }

  async getAllCharacters(offset = this._baseOffset) {
    const persons = await this
      .getResource(`${this._apiBASE}/characters?limit=9&offset=${offset}&apikey=${this._apiKey}
    `);

    return persons.data.results.map(this._transformCharacter);
  }

  async getCharacter(id) {
    const person = await this.getResource(
      `${this._apiBASE}/characters/${id}?apikey=${this._apiKey}`
    );
    return this._transformCharacter(person.data.results[0]);
  }

  isValidDescription(description) {
    if (description.length > 0 && description.length < 181) {
      return description;
    }
    if (description.length === 0) {
      return "This character has no description";
    }

    if (description.length > 180) {
      return description.slice(0, 180) + "...";
    }
  }

  _transformCharacter(person) {
    return {
      id: person.id,
      name: person.name,
      description:
        person.description.length > 1 && person.description.length < 180
          ? person.description
          : "This Char doesn't have description",
      thumpnail:
        person.thumbnail.path + ".jpg" ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
          ? "https://img1.goodfon.ru/wallpaper/nbig/e/c1/marvel-studio-marvel-studiya.jpg"
          : person.thumbnail.path + ".jpg",
      homepage: person.urls[0].url,
      wiki: person.urls[1].url,
    };
  }
}
export default MarvelService;
