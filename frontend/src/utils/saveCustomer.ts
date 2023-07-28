import pool from "../api/pool"
import { useLoginStore } from "../store"
import e2c from "./e2c";
import { saveCSV } from "./exportReport"

function generateContactArray(n: number): string[] {
    const result: string[] = [];
    for (let i = 1; i <= n; i++) {
        result.push(`联系工具 ${i}`, `联系方式 ${i}`);
    }
    return result;
}

export default async () => {
    const store = useLoginStore()
    const customers = await pool.getAll()
    const data = customers.map((item) => item.contact.length)
    // console.log(Math.max(...data));
    const maxContacts = Math.max(...data)
    // console.log(maxContacts);
    const header = `id,公司全称,意向产品,跟进内容,意向状态,客户来源,${generateContactArray(maxContacts).join(",")}\n`
    var content = ""
    for (let customer of customers) {
        // customer.contactMethod = e2c.ContactMethod[customer.contactMethod];
        customer.learnFrom = e2c.LearnFrom[customer.learnFrom];
        customer.status = e2c.Status[customer.status];
        content += `${customer.id},${customer.name},${customer.production},${customer.contactContent},${customer.status},${customer.learnFrom},${(customer.contact as any as Array<{contactMethod: string,contactContent: string}>).map(item => item.contactMethod + "," + item.contactContent).join(",")}\n`
    }
    saveCSV(header+content,"客户信息")
}