import getPublic from "../../db/pool/getPublic";
import useDB from "../../db/useDB";
import user from "../../db/user";

interface Params {
    token: string
}

export default eventHandler(async (event) => {
    const db = await useDB()

    return await db.get("pool",{});
});
