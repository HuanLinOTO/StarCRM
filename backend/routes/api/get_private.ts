import getPrivate from "../../db/pool/getPrivate";
import user from "../../db/user";

interface Params {
    token: string
}

export default eventHandler(async (event) => {
    // console.log(event);
    const params = getQuery(event) as unknown as Params;
    if(!params.token) return { code: -1, msg: "缺少 token 参数" }
    return await getPrivate(params.token);
});
    