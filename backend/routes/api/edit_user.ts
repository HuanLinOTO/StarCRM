import { userDB } from "../../db/types";
import user from "../../db/user";
import editUser from "../../db/user/editUser";

export default eventHandler(async (event) => {
    // console.log(event);
    const params = getQuery(event) as unknown as userDB;
    if(!params.id || !params.name || !params.password || !params.role) return { code: -1, msg: "缺少参数" }
    return editUser(params);
});
