import { useLoginStore } from "../store";
import { userDB } from "./../../../backend/db/types.d";
import axios from "./axios";

export type CommonUserResponse = { code: 0 | -1 | -2; msg: string };

export type LoginResponse = {
  token?: string;
  user: {
    id: number;
    name: string;
    password: string;
    token: string;
    role: "admin" | "user";
  };
} & CommonUserResponse;

export default {
  async login(name: string, password: string, captcha: string, ctoken: string): Promise<LoginResponse> {
    return (
      await axios.get("/login", {
        params: {
          name,
          password,
          captcha,
          ctoken
        },
      })
    ).data;
  },

  async addUser(name: string, password: string, role: "admin" | "user"): Promise<CommonUserResponse> {
    const store = useLoginStore()
    return (
      await axios.get("/add_user", {
        params: {
          name,
          password,
          role,
          token: store.token
        },
      })
    ).data;
  },
  async getUser(
    token: string
  ): Promise<
    | ((userDB & { found: true })
    | { users: userDB[]; found: true })
    | { found: false }
  > {
    var params: any = { token }
    if(token == "all") {
      const store = useLoginStore()
      params.admin_token = store.token
      console.log("GetAll", store.token, params)
    } 
    return (
      await axios.get("get_user", {
        params
      })
    ).data;
  },
  async editUser(
    params: userDB
  ): Promise<CommonUserResponse> {
    return (
      await axios.get("edit_user", {
        params,
      })
    ).data;
  },
  async getCaptcha() {
    return (await axios.get("get_captcha")).data
  }
};
