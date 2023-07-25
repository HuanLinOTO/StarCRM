declare module "./useDB" {
  interface Tables {
    users: userDB;
    pool: poolDB;
    "statistics.creation": creationStatisticsDB;
    "statistics.sign": signStatisticsDB;
  }
}

export interface userDB {
  id: number;
  name: string;
  password: string;
  token: string;
  role: "admin" | "user"; 
  dailyCreation: number;
}

export type ContactMethod = "WeChat" | "EMail" | "Phone" | "Other"
export type Status = "Interested" | "NotInterested" | "Signed"
export type LearnFrom = "Friend" | "Internet"

export interface Contact {
  ContactMethod: ContactMethod;
  ContactContent: string;
}

export interface poolDB {
  id: number;
  name: string; // 公司全称
  contact: string;
  owner: number; // 认领人 id，-1 表示公有
  status: Status | string; // 是否有意向
  learnFrom: LearnFrom | string;
  lastOperateTime: Date;
}

export interface creationStatisticsDB {
  id?: number
  date: Date
  operator: number
  cid: number
} 

export interface signStatisticsDB extends creationStatisticsDB {
    
}