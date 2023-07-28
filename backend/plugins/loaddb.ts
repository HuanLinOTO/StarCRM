import "dotenv/config"
import useDB from "../db/useDB";

export default defineNitroPlugin(async (nitroApp) => {
    console.log("Load db");
    // console.log(nitroApp);
    
    await useDB()
})