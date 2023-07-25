import useDB from '../useDB';
import { creationStatisticsDB } from './../types.d';
export default async (params: creationStatisticsDB) => {
    const db = await useDB();
    const { id, date, operator, cid } = params;
    return await db.create("statistics.creation", { date, operator, cid });
}