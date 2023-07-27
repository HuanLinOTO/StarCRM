import randstr from "../../utils/randstr";
import { userDB } from "../types";
import useDB from "../useDB";

export default async (name: string, password: string) => {
  const db = await useDB();
  const user: userDB[] = await db.get("users", { name, password });

  // console.log(user);
  
  if (user.length === 0) {
    return { code: -2, msg: "用户名或密码错误" };
  } else {
    const token = randstr(32);

    await db.set("users", { id: user[0].id }, { token });
    console.log(`User ${user[0].name} logged in. Token: ${token}`);
    user[0].token = token;
    return { code: 0, msg: "登陆成功", token, user: user[0] };
  }
};
