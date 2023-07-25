// import getus from "../../db/pool/getPublic";
import user from "../../db/user";
import getUser from "../../db/user/getUser";

interface Params {
    token: string
}

export default eventHandler(async (event) => {
    const params = getQuery(event) as unknown as Params;
    if(!params.token) return { code: -1, msg: "缺少 token 参数" }
    return await getUser(params.token);
});
