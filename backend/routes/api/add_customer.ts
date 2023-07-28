import addCustomer from "../../db/pool/addCustomer";
import creation from "../../db/statistics/creation";
import { poolDB, ContactMethod, Status, LearnFrom, userDB } from "../../db/types";
import getUser from "../../db/user/getUser";
import parseContact from "../../utils/parseContact";

export default eventHandler(async (event) => {
  // console.log(event);
  const params = getQuery(event) as unknown as (poolDB & { token:string }); 
  // console.log("",params,parseContact(params));
  // 我觉得有些，lastOperateTime 应该直接 new Date(), 毕竟是创建
  // return {code: -3, msg: "Debug"}
  if(!process.env.IGNORE_PREMISIION) {
    if (
      !params.name ||
      !params.contact ||
      !params.contactContent ||
      !params.owner ||
      !params.status ||
      !params.learnFrom ||
      !params.token
    )
      return { code: -1, msg: "缺少参数" };
    const Owner = (await getUser(params.token)) as userDB & { found: boolean };
    if (!Owner.found) return { code: -2, msg: "token 异常" };
    params.owner = Owner.role == "admin"? params.owner : Owner.id;
  }

  // params.owner = (().id;
  const res = await addCustomer({
    name: params.name,
    contact: params.contact,
    owner: params.owner,
    production: params.production,
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
