import getPublic from "../../db/pool/getPublic";
import user from "../../db/user";
import getUser from "../../db/user/getUser";

interface Params {
    token: string
}

export default eventHandler(async (event) => {
    const params = getQuery(event) as unknown as Params;
    // 验证 token 对应用户是否存在
    return await getPublic();
});
