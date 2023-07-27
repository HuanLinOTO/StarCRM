import { CaptchaConfigManager, create } from 'gimpy-captcha';
// import getus from "../../db/pool/getPublic";

// import { useStorage } from "nitropack/dist/runtime/storage";
// import { create } from "svg-captcha"
interface Params {
    action: string
}

const captchaConfig = CaptchaConfigManager.default({
    mode: "code", // or code
    // cryptoKey: Buffer.from("ezrvvv"),
    // signatureKey: Buffer.from("man0lett3"),
    noise: 20,
});

let query_count = 0, stopCount = 0
let clearQueryCountInterval = null;
let clearStopCountInterval = null;

export default eventHandler(async (event) => {
    query_count ++;
        
    if(!clearQueryCountInterval) {
        clearQueryCountInterval = setInterval(() => {
            query_count = 0
        },60*1000)
    }
    
    const storage = useStorage()
    if(query_count > 30) {
        event.res.statusCode = 429
        storage.clear()
        stopCount ++;
        if(stopCount > 3) {
            if(!clearStopCountInterval) setTimeout(() => {
                stopCount = 0
                clearStopCountInterval = null
            },5*1000*60)
            return { code: 429, msg: "接口受到严重攻击，将长时间关闭验证码" }
        }
        return { code: 429, msg: "接口受到攻击，暂时关闭验证码" }
    }
    const params = getQuery(event) as unknown as Params;
    const token = randstr(32)
    const captcha = create(captchaConfig)
    await storage.setItem(`captcha.${token}`,JSON.parse(captcha.expr).captcha.code)
    setTimeout(() => {
        storage.removeItem(`captcha.${token}`)
    },60 * 60 * 100)
    // QPS限制，如果每秒请求超过2次，就会返回429
    
    return {
        img: captcha.captchaSvg,
        token: token
    }
});
