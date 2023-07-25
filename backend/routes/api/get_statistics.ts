import useDB from "../../db/useDB";
import isSameDay from "../../utils/isSameDay";

export interface Params {
    today?: boolean,
    date?: number,
    oid?: number
}

export default eventHandler(async (event) => {
    const db = await useDB();
    // const query = params.today || isSameDay(params.date,Date.now())
    var params = getQuery(event) as unknown as Params;
    if(params.today) params.today = true;
    if(params.date) params.date = Number(params.date);
    if(params.oid) params.oid = Number(params.oid);
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
    })
    data.sign = data.sign.map(item => {
        // @ts-ignore
        item.date = item.date.getTime()
        return item;
    })
    
    if(params.oid) {
        data.contribution.creation = data.creation.filter(item => item.operator === params.oid).length
        data.contribution.sign = data.sign.filter(item => item.operator === params.oid).length
    }
    return {
        code: 0,
        data,
    }
})