// 输入两个参数为认领者的token和认领的公司的id，从user数据库中取出token对应的user的id，如果不存在这个user，就返回code -1, msg 用户不存在或者token过期，如果存在，就把数据库中这个id对应的公司的owner变成这个用户的id


// Context from Code Snippet d:/Project/rccrm/backend/db/pool/editCustomer.ts:import { poolDB } from "../types";
import { poolDB } from "../types";
import useDB from "../useDB";
import getUser from "../user/getUser";

export interface ClaimParams {
  token: string,
  cid: number
}

export default async (params: ClaimParams) => {
  const db = await useDB();
  const { token, cid } = params;
  console.log(params);
  
  const user = await getUser(token)
  if(!user.found) return { code: -1, msg: "用户不存在或者token过期" }
  // @ts-ignore
  const { id } = user as (poolDB & { found: boolean });
  console.log(id);
  
  db.set("pool",{ id: cid }, { owner: id });
  return { code: 0, msg: "认领客户成功" };
};