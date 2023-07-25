import { poolDB, userDB } from "./../../../backend/db/types.d";
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
  async login(name: string, password: string): Promise<LoginResponse> {
    return (
      await axios.get("/login", {
        params: {
          name,
          password,
        },
      })
    ).data;
  },

  async addUser(name: string, password: string, role: "admin" | "user"): Promise<CommonUserResponse> {
    return (
      await axios.get("/add_user", {
        params: {
          name,
          password,
          role
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
    return (
      await axios.get("get_user", {
        params: {
          token,
        },
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
};
