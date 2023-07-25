import axios from "./axios"

interface Params {
    key: string,
    value: any
}

export default {
    getSettings: async () => {
        return (await axios.get("get_settings")).data
    },
    setSettings: async (params: Params) => {
        return (await axios.get("set_settings", {
            params
        })).data
    }
}