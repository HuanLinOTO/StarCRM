import getPublic from "../../db/pool/getPublic";
import user from "../../db/user";
import getUser from "../../db/user/getUser";

interface Params {
    token: string
}

export default eventHandler(async (event) => {
    const params = getQuery(event) as unknown as Params;
    if(!params.token) return { code: -1, msg: "缺少参数" }
    // 验证 token 对应用户是否存在
    if(!((await getUser(params.token)).found)) return { code: -1, msg: "token 无效" }
    return await getPublic();
});
