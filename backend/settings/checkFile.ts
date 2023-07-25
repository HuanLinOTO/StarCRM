// @ts-ignore
import fs from "fs-extra" // 这样子应该是那的默认导出
export default async () => {
    // console.log(fs);
    
    const isExists = await fs.pathExists("./settings.json")
    if(!isExists) await fs.outputJson("./settings.json", {
        dailyCreation: 50
    })
}