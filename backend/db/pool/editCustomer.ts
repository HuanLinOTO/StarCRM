import { poolDB } from "../types";
import useDB from "../useDB";
import getUser from "../user/getUser";

export default async (params: poolDB) => {
  const db = await useDB();
  let data = structuredClone(params);
  delete data.id
  data.lastOperateTime = new Date()
  return await db.set("pool", { id: params.id }, data)
};
