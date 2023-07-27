import { userDB } from "../db/types";
import getUser from "../db/user/getUser";

export default async function verifyAdminByToken(token: string) {
    return ((await getUser(token)) as userDB).role == "admin"
}