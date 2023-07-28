import useDB from "../../db/useDB";
import isSameDay from "../../utils/isSameDay";
import { getQuery } from "h3"
export interface Params {
    today?: boolean,
    date?: number,
    oid?: number,
    data2?: boolean
}

export default eventHandler(async (event) => {
    const db = await useDB();
    // const query = params.today || isSameDay(params.date,Date.now())
    var params = getQuery(event) as unknown as Params;
    if(params.today) params.today = true;
    if(params.date) params.date = Number(params.date);
    if(params.oid) params.oid = Number(params.oid);
    if(params.data2) params.data2 = Boolean(params.data2);
    const data = {
        creation: await db.get("statistics.creation", {}),
        sign: await db.get("statistics.sign", {}),
        contribution: {
            creation: undefined,
            sign: undefined
        }
    }
    const queryDate = params.today?Date.now():undefined || params.date
    if(queryDate !== undefined) {
        data.creation = data.creation.filter(item => isSameDay(item.date.getTime(),queryDate))
        data.sign = data.sign.filter(item => isSameDay(item.date.getTime(),queryDate))
    }
    
    data.creation = data.creation.map(item => {
        // @ts-ignore
        item.date = item.date.getTime()
        return item;
    }).filter(item => !params.data2 || item.operator == params.oid)
    data.sign = data.sign.map(item => {
        // @ts-ignore
        item.date = item.date.getTime()
        return item;
    }).filter(item => !params.data2 || item.operator == params.oid)
    
    if(params.oid) {
        // @ts-ignore
        data.contribution.creation = data.creation.filter(item => item.operator === params.oid).length
        // @ts-ignore
        data.contribution.sign = data.sign.filter(item => item.operator === params.oid).length
    }
    return {
        code: 0,
        data,
    }
})