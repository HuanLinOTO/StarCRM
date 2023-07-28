import { ContactMethod, LearnFrom, Status, poolDB } from "../types";
import useDB from "../useDB";

export interface AddCustomerOptions {
  name: string, // 公司全称
  contact: string
  owner: number, // 认领人 id，-1 表示公有
  status: Status, // 是否有意向
  learnFrom: LearnFrom,
  lastOperateTime: Date
  production: string
}

export default async (options: AddCustomerOptions) => {
  const db = await useDB();
  // console.log(options.lastOperateTime);
  if((await db.get("pool",{ name: options.name })).length !== 0) return false;
  console.log(options.production);
  
  return await db.create("pool", {
    name: options.name,
    contact: options.contact,
    owner: options.owner,
    status: options.status,
    learnFrom: options.learnFrom,
    production: options.production,
    lastOperateTime: options.lastOperateTime
  })
};
