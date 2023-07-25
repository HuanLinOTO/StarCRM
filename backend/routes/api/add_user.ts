import user from "../../db/user";

interface Params {
    name: string,
    password: string,
    // captcha: string,
    role: "admin" | "user"
}

export default eventHandler(async (event) => {
    // console.log(event);
    const params = getQuery(event) as unknown as Params;
    if(!params.name || !params.password || !params.role) return { code: -1, msg: "缺少参数" }
    if(await user.addUser(params.name, params.password, params.role))
        return { code: 0, msg: "添加成功" };
    else
        return { code: -1, msg: "添加失败，重复用户" };

});
