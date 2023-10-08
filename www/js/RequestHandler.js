const config = {
  baseUrl: "https://urchin-app-qxcfm.ondigitalocean.app/api",
};

export class RequestHandler {
  // for now the access token is stored in the local storage
  // should be encrypted before storing at least
  #accessToken;
  baseUrl = config.baseUrl;
  isAuthenticated = false;

  constructor() {
    // initializing the request handler
    this.#loadToken();

    // if a token is available in the local storage
    // set the isAuthenticated to true
    if (this.#getToken()) {
      this.isAuthenticated = true;
    }
  }

  setToken(token) {
    // store the access token in the local storage for future reference
    // for now not encrypted but should be encrypted if possible in the
    // future
    localStorage.setItem("token", token);
    this.#accessToken = token;
  }

  async sendServerPingRequest() {}

  async sendLoginRequest(credentials) {
    const route = "user/login";
    const method = "POST";

    return await this.#sendRequest(this.#getUrl(route), false, {
      method,
      data: JSON.stringify(credentials),
    });
  }

  async getUser() {
    const route = "user";
    const method = "GET";

    return await this.#sendRequest(this.#getUrl(route), true, {
      method,
    });
  }

  async sendSignUpRequest(user) {}

  async getHabitWithLog(date = "", habitId = "") {
    const route = `habit/${habitId}`;
    const query = {
      date,
    };
    const method = "GET";

    return await this.#sendRequest(this.#getUrl(route, query), true, {
      method,
    });
  }

  async getAllHabitsWithLogs(date = "") {
    const route = "habit/all";
    const query = {
      date,
    };
    const method = "GET";

    return await this.#sendRequest(this.#getUrl(route, query), true, {
      method,
    });
  }

  async sendCreateHabitRequest(habit) {
    const route = "habit";
    const method = "POST";

    return await this.#sendRequest(this.#getUrl(route), true, {
      method,
      data: JSON.stringify(habit),
    });
  }

  async sendUpsertHabitLogRequest(patch) {
    const route = "habit-log/upsert";
    const method = "PATCH";

    return await this.#sendRequest(this.#getUrl(route), true, {
      method,
      data: JSON.stringify(patch),
    });
  }

  async getHabitSummary() {}

  async logHabit() {}

  async logout() {
    const route = "user";
    const method = "GET";

    return await this.#sendRequest(this.#getUrl(route), true, {
      method,
    }).then((result) => {
      // set the flag to false
      this.isAuthenticated = false;
      // remove the token from local storage
      localStorage.removeItem("token");
      // returning the result to be accessible to the outside
      return result;
    });
  }

  /**
   * A private method used to load the token when the request handler is being initialized
   */
  #loadToken() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setToken(token);
    }
  }

  #getToken() {
    return this.#accessToken;
  }

  /**
   *
   * @param  {string} segment Segments of the route that creates the url. Do not add / at the beginning or end of the segments
   * @param {object} query An object that will be encoded into url query string
   * @returns
   */
  #getUrl(segment, query) {
    let queryString = "?";
    for (let key in query) {
      queryString += `${key}=${query[key]}`;
    }
    // TODO : handle the query params
    return `${config.baseUrl}/${segment}${query ? queryString : ""}`;
  }

  #sendRequest(url, isAuthEnabled, settings = {}) {
    const token = this.#accessToken;
    return new Promise((resolve, reject) => {
      $.ajax({
        beforeSend(xhr) {
          if (!isAuthEnabled) return;
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        },
        contentType: "application/json; charset=utf-8",
        crossOrigin: true,
        dataType: "json",
        url: url,
        ...settings,

        success(data) {
          resolve(data);
        },
        error(data) {
          reject(data);
        },
      });
    });
  }
}
