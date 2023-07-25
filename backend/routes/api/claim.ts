import claim from "../../db/pool/claim";
import user from "../../db/user";

interface Params {
    token: string
    cid: number
}

export default eventHandler(async (event) => {
    // console.log(event);
    const params = getQuery(event) as unknown as Params;
    if(!params.token || !params.cid) return { code: -1, msg: "缺少参数" }
    return claim(params);
});
