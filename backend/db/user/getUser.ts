import randstr from "../../utils/randstr";
import { userDB } from "../types";
import useDB from "../useDB";

export default async (token: string): Promise<((userDB & { found: true}) | {users: userDB[], found: true}) | {found: false}> => {
  const db = await useDB();
  const users = (token == "all" || token == "name" ? await db.get("users",{}): await db.get("users", { token })).map((item) => {
    delete item.token
    delete item.password
    if(token == "name") {
      delete item.dailyCreation
      delete item.role
    }
    return item
  });
  // console.log(users);
  
  if(users.length == 0) return { found: false };
  return token == "all" || token == "name" ? { users: users, found: true }:{ ...users[0], found: true }
};
