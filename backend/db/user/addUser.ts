import randstr from "../../utils/randstr";
import { userDB } from "../types";
import useDB from "../useDB";
export default async (name: userDB["name"], password: userDB["password"], role: userDB["role"], isBot?: boolean) => {
  const db = await useDB();
  if((await db.get("users", { name })).length == 0) {
    const token = isBot? randstr(32): "";
    return db.create("users", { name, password, role, token });
  }
  else return false;
};
