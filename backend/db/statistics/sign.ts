import useDB from '../useDB';
import { signStatisticsDB } from './../types.d';
export default async (params: signStatisticsDB) => {
    const db = await useDB();
    const { id, date, operator, cid } = params;
    return await db.create("statistics.sign", { date, operator, cid });
}