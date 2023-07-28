import user from "../../db/user";
import verifyAdminByToken from "../../utils/verifyAdmin";

interface Params {
    name: string,
    password: string,
    // captcha: string,
    role: "admin" | "user",
    token: string
}

export default eventHandler(async (event) => {
    // console.log(event);
    const params = getQuery(event) as unknown as Params;
    if(!process.env.IGNORE_PREMISIION) {
        if(!params.name || !params.password || !params.role || !params.token) return { code: -1, msg: "缺少参数" }
        if(!await verifyAdminByToken(params.token)) return { code: -2, msg: "权限不足" }
    }
    if(await user.addUser(params.name, params.password, params.role))
        return { code: 0, msg: "添加成功" };
    else
        return { code: -1, msg: "添加失败，重复用户" };

});
