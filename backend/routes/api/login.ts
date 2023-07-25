import useDB from "../../db/useDB"
import user from "../../db/user";

interface Params {
    name: string,
    password: string,
    // captcha: string,
}

export default eventHandler(async (event) => {
    // console.log(event);

    const params = getQuery(event) as unknown as Params;
    if(!params.name || !params.password) return { code: -1, msg: "缺少 name or password 参数" }

    // user.verify(params.name,params.password)
    
    return user.verify(params.name,params.password)
});
