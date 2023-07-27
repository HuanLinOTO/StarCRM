// import getus from "../../db/pool/getPublic";
import { userDB } from "../../db/types";
import user from "../../db/user";
import getUser from "../../db/user/getUser";
import verifyAdminByToken from "../../utils/verifyAdmin";

interface Params {
    token: string
    admin_token?: string
}

export default eventHandler(async (event) => {
    const params = getQuery(event) as unknown as Params;
    if(!params.token) return { code: -1, msg: "缺少 token 参数" }
    if(params.token != "all" && !((await getUser(params.token)).found)) return { code: -1, msg: "token 无效" }
    if(params.token == "all" && !params.admin_token ) return { code: -1, msg: "缺少管理员 token" }
    if(params.token == "all" && !await verifyAdminByToken(params.admin_token)) return { code: -1, msg: "管理员 token 无效" }
    return await getUser(params.token);
});
