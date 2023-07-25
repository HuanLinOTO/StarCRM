import randstr from "../../utils/randstr";
import { userDB } from "../types";
import useDB from "../useDB";

export default async (token: string): Promise<((userDB & { found: true}) | {users: userDB[], found: true}) | {found: false}> => {
  const db = await useDB();
  const users = token == "all"? await db.get("users",{}): await db.get("users", { token });
  console.log(users);
  
  if(users.length == 0) return { found: false };
  return token == "all"? { users: users, found: true }:{ ...users[0], found: true }
};
