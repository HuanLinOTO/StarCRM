import { Database } from 'minato'
import { resolve as pres } from "path"

export interface Tables{}

let database: Database<Tables>;

export default async () => {
    if(!database) {
        database = new Database();
        await database.connect('sqlite',{
            path: pres(".data.db")
        })  
    }
    database.extend("users", {
        id: "integer",
        name: "char",
        password: "char",
        token: "char",
        role: "char",
        dailyCreation: "integer"
    });
    database.extend("pool", {
        id: "integer",
        name: "char",
        contact: "text",
        contactContent: "text",
        owner: "integer",
        status: "char",
        learnFrom: "char",
        production: "char",
        lastOperateTime: "timestamp"
    })
    database.extend("statistics.creation", {
        id: "integer",
        date: "timestamp",
        operator: "integer",
        cid: "integer"
    })
    database.extend("statistics.sign", {
        id: "integer",
        date: "timestamp",
        operator: "integer",
        cid: "integer"
    })
    return database;
}