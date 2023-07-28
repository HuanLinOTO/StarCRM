import randstr from "../../utils/randstr";
import { userDB } from "../types";
import useDB from "../useDB";

export default async (
  params: userDB
): Promise<{ code: number; msg: string }> => {
  const db = await useDB();
  let data = structuredClone(params);
  delete data.id;
  db.set("users", { id: params.id }, data);
  return {code: 0, msg: "修改成功"}
};
