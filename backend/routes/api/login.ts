import useDB from "../../db/useDB"
import user from "../../db/user";

interface Params {
    name: string,
    password: string,
    captcha: string,
    ctoken: string,
}

export default eventHandler(async (event) => {
    // console.log(event);
    const storage = useStorage()
    const params = getQuery(event) as unknown as Params;
    if(!params.name || !params.password || !params.captcha || !params.ctoken) return { code: -1, msg: "缺少参数" }
    const captcha_token = await storage.getItem(`captcha.${params.ctoken}`)
    // console.log(captcha_token);
    
    if(!captcha_token || params.captcha !== captcha_token) return { code: -1, msg: "验证码错误" }
    return await user.verify(params.name,params.password)
});
