import addCustomer from "../../db/pool/addCustomer";
import creation from "../../db/statistics/creation";
import { poolDB, ContactMethod, Status, LearnFrom } from "../../db/types";
import parseContact from "../../utils/parseContact";

export default eventHandler(async (event) => {
  // console.log(event);
  const params = getQuery(event) as unknown as poolDB; 
  // console.log("",params,parseContact(params));
  // 我觉得有些，lastOperateTime 应该直接 new Date(), 毕竟是创建
  // return {code: -3, msg: "Debug"}
  if (
    !params.name ||
    !params.contact ||
    !params.owner ||
    !params.status ||
    !params.learnFrom
  )
    return { code: -1, msg: "缺少参数" };
  const res = await addCustomer({
    name: params.name,
    contact: params.contact,
    owner: params.owner,
    status: params.status as Status,
    learnFrom: params.learnFrom as LearnFrom,
    lastOperateTime: new Date()
  });
  if(res) {
    await creation({
      date: new Date(),
      operator: params.owner,
      cid: res.id
    })
    return { code: 0, msg: "添加成功" };
  } else {
    return { code: -2, msg: "重复添加" };
  }
});
