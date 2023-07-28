import { userDB } from "../../../backend/db/types"
import statistics from "../api/statistics"
import user from "../api/user"
import groupStatisics from "./groupStatisics"

export const saveCSV = (csvContent: string, filename: string = "") => {
    var blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
        type: "text/csv;charset=GBK",
    });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // 设定下载文件名字为 润才RCM-YYYY/MM/DD.csv
    link.download = `润才CRM-${filename}-${new Date().toLocaleDateString().replace(/\//g, "-")}.csv`;
    link.click(); // 触发下载动作
}

const sum = (arr: number[]): number => {
    var _sum = 0
    for(var i = 0;i < arr.length;i++){
        _sum += arr[i];
    }
    return _sum
}

export default async (reportDate: [Date,Date]) => {
    const { users: allUsers } = await user.getUser("all") as { users: userDB[] }
    
    var max_ncreation = 0
    var max_nsign = 0

    // 通过统计api获取每个用户的所有统计数据
    const allUserStats = await Promise.all(
        allUsers.map(async (user) => {
            const { data } = await statistics({
                oid: user.id,
                data2: true
            })
            // @ts-ignore
            const creation = groupStatisics(data.creation.filter((item) => {
                // 判断时间是否在 reportDate 的范围内
                return item.date >= reportDate[0] && item.date <= reportDate[1]
            }),true)
            // @ts-ignore
            const sign = groupStatisics(data.sign.filter((item) => {
                // 判断时间是否在 reportDate 的范围内
                return item.date >= reportDate[0] && item.date <= reportDate[1]
            }),true)
            max_ncreation = Math.max(max_ncreation, Object.keys(creation).length)
            max_nsign = Math.max(max_nsign, Object.keys(sign).length)
            return {
                creation,
                sign,
                dailyCreation: user.dailyCreation 
            }
        })
    )

    var dayIsAlive: Record<string,boolean> = {}
    var day2usercreation: Record<string, Record<string,number>> = {}
    var dayArray = []
    var name2stats: Record<string,any> = {}

    
    for (const i in allUsers) {
        name2stats[allUsers[i].name] = allUserStats[i]
    }
    console.log(name2stats);
    
    // @ts-ignore
    for (const username in name2stats) {
        var userstats = name2stats[username].creation
        for (const key in userstats) {
            if(!dayIsAlive[key]) {
                dayIsAlive[key] = true
                dayArray.push(key)
            }
            if(!day2usercreation[key]) {
                day2usercreation[key] = {}    
            }
            day2usercreation[key][username] = userstats[key].length
        }
    }
    dayArray = dayArray.sort()
    console.log(dayArray,day2usercreation);

    // var isDayHaveUser: Record<string, Record<string,boolean>> = {}

    var creationResult: Record<string,number[]> = {}

    for (const username in name2stats) {
        let creationArray = []
        for (const time of dayArray) {
            if(day2usercreation[time][username]) {
                // day2usercreation[time][username] = true
                creationArray.push(day2usercreation[time][username])
            } else {
                creationArray.push(0)
            }
        }
        console.log(creationArray);
        creationResult[username] = creationArray
    }
    
    var csvContent = `账户名,${dayArray.join(",")},额定任务,任务完成率,总签约数\n`
    for (const name in creationResult) {
        // console.log(Object.keys(name2stats[name].sign));
        
        csvContent += `${name},${creationResult[name].join(",")},${name2stats[name].dailyCreation},${Number((sum(creationResult[name])/name2stats[name].dailyCreation).toFixed(2)) * 100}%,${Object.keys(name2stats[name].sign).length}\n`
    }
    saveCSV(csvContent,"报表")
    // debugger
    console.log(csvContent)
    console.log(name2stats);
    
}