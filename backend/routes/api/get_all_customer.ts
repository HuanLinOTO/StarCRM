import getPublic from "../../db/pool/getPublic";
import useDB from "../../db/useDB";
import user from "../../db/user";
import verifyAdminByToken from "../../utils/verifyAdmin";

interface Params {
    token: string
}

export default eventHandler(async (event) => {
    const params = getQuery(event) as unknown as Params;
    if(!await verifyAdminByToken(params.token)) return { code: -1, msg: "管理员 token 无效" }
    const db = await useDB()

    return await db.get("pool",{});
});
