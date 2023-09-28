const config = {
  baseUrl: "http://localhost:3000/api",
};

export class RequestHandler {
  // for now the access token is stored in the local storage
  // should be encrypted before storing at least
  #accessToken = "";
  baseUrl = config.baseUrl;

  constructor() {}

  async sendServerPingRequest() {}

  async sendLoginRequest() {
    const route = "/user";
    const method = "POST";
  }

  async sendSignUpRequest() {}

  async getAllHabits() {}

  async getHabitSummary() {}

  async logHabit() {}
}
