import { userDB } from "../../db/types";
import addUser from "../../db/user/addUser";
import verifyAdminByToken from "../../utils/verifyAdmin";

interface Params {
    name: userDB["name"],
    password: userDB["password"],
    // captcha: string,
    role: userDB["role"],
    token: userDB["token"]
}

export default eventHandler(async (event) => {
    // console.log(event);
    const params = getQuery(event) as unknown as Params;
    if(!process.env.IGNORE_PREMISIION) {
        if(!params.name || !params.password || !params.role || !params.token) return { code: -1, msg: "缺少参数" }
        if(!await verifyAdminByToken(params.token)) return { code: -2, msg: "权限不足" }
    }
    var res;
    if(params.role == "bot") {
        res = await addUser(params.name, params.password, params.role, true)
    } else {
        res = await addUser(params.name, params.password, params.role)
    }
    if(res)
        return { code: 0, msg: params.role == "bot"? "修改成功，机器人 Token 已生成": "添加成功" };
    else
        return { code: -1, msg: "添加失败，重复用户" };

});
