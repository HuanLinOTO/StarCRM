import getPublic from "../../db/pool/getPublic";
import getSettings from "../../settings/getSettings";

export default eventHandler(async (event) => {
    return await getSettings();
});
