import setSettings from "../../settings/setSettings";

interface Params {
    key: string,
    value: any
}

export default eventHandler(async (event) => {
    const params = getQuery(event) as unknown as Params;
    if(!params.key || !params.value) return { code: -1, msg: "缺少参数" }

    return await setSettings(params);
});
