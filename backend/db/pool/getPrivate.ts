import { Contact, poolDB, userDB } from "../types";
import useDB from "../useDB";
import getUser from "../user/getUser";

export default async (token: string) => {
  const db = await useDB();
  const user = await getUser(token);
  if(!user.found) return [];
//   console.log(user);
  // console.log(user.id);  
  // @ts-ignore
  const data = await db.get("pool", { owner: user.id }) as poolDB[];

  // 从data中筛选出最后操作时间距离今天超过90day的
  const today = new Date();
  const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    const result = data.filter((item) => {
      const lastOperateTime = new Date(item.lastOperateTime);
      return lastOperateTime < ninetyDaysAgo;
    });

  // 将超过90day的拥有者改成-1
  result.forEach((item) => {
    item.owner = -1;
    const { id } = item
    delete item.id

    db.set("pool",{id},item)
  });

  // console.log(data); 

  // 返回还没超过 90day 的, 不是result
  return data.filter((item) => {
    const lastOperateTime = new Date(item.lastOperateTime);
    return lastOperateTime >= ninetyDaysAgo;
  })
};
