import randstr from "../../utils/randstr";
import { userDB } from "../types";
import useDB from "../useDB";
export default async (name: string, password: string, role: "admin" | "user") => {
  const db = await useDB();
  if((await db.get("users", { name })).length == 0)
    return db.create("users", { name, password, role });
  else return false;
};
