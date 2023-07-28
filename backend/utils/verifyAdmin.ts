import { userDB } from "../db/types";
import getUser from "../db/user/getUser";

export default async function verifyAdminByToken(token: string) {
    const u = ((await getUser(token)) as userDB)
    return u.role == "admin" || u.role == "bot"
}