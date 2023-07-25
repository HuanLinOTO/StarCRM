import editCustomer from "../../db/pool/editCustomer";
import sign from "../../db/statistics/sign";
import { poolDB } from "../../db/types";
import user from "../../db/user";

export default eventHandler(async (event) => {
  // const params = getQuery(event) as unknown as poolDB;
  const params = getQuery(event) as unknown as poolDB; 

  if (
    !params.name ||
    !params.contact ||
    !params.owner ||
    !params.status ||
    !params.learnFrom ||
    !params.lastOperateTime
  )
    return { code: -1, msg: "缺少参数" };
  if(params.status === "Signed") sign({
    operator: params.owner,
    cid: params.id,
    date: new Date()
  })
  await editCustomer(params);
  return {code: 0, msg: "操作成功"}
});
