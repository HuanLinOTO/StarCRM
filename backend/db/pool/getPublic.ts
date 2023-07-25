import useDB from "../useDB";

// 筛选出所有owner==-1的项目，来自表pool
export default async () => {
    const db = await useDB();
    return await db.get("pool", { owner: -1 })
};