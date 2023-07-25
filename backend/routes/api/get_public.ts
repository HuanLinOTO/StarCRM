import getPublic from "../../db/pool/getPublic";
import user from "../../db/user";

interface Params {
    token: string
}

export default eventHandler(async (event) => {
    return await getPublic();
});
