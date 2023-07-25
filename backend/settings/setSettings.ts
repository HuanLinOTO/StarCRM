// @ts-ignore
import fs from "fs-extra"
import getSettings from "./getSettings"

interface Params {
    key: string,
    value: any
}

export default async (params: Params) => {
    const settings = await getSettings()
    settings[params.key] = params.value;
    fs.outputJson("./settings.json", settings)
    return { code: 0, msg: "修改成功" }
}