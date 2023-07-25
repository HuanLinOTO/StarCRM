// @ts-ignore
import fs from "fs-extra"
import checkFile from "./checkFile"
export default async () => {
    await checkFile()
    return await fs.readJson("./settings.json")
}