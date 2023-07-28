import randstr from "../../utils/randstr";
import { userDB } from "../types";
import useDB from "../useDB";

export default async (
  params: userDB
): Promise<{ code: number; msg: string }> => {
  const db = await useDB();
  let data = structuredClone(params);
  delete data.id;
  // 感谢 Copilot 送来的 JS magic
  params.role == "bot" && (data.token = randstr(32));
  db.set("users", { id: params.id }, data);
  // return {code: 0, msg: "修改成功"}
  // 如果身份是机器人的话，返回 msg 修改成功，机器人token已生成
  // 否则返回 msg 修改成功
  return {
    code: 0,
    msg: params.role == "bot" ? "修改成功，机器人 Token 已生成" : "修改成功",
  }
};
