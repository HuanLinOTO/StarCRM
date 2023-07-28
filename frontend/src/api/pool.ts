import { use } from "echarts";
import { poolDB } from "../../../backend/db/types";
import axios from "./axios";
import { useLoginStore } from "../store";

export default {
  async getPrivate(token: string): Promise<poolDB[]> {
    var data = (
      await axios.get("get_private", {
        params: {
          token,
        },
      })
    ).data
    // console.log(item.contact);
    
    data = data.map((item: any) => {
      item.contact = JSON.parse(item.contact)
      return item
    })
    // console.log(data);
    return data;
  },
  async getPublic(): Promise<poolDB[]> {
    var data = (await axios.get("get_public")).data;
    data = data.map((item: any) => {
      item.contact = JSON.parse(item.contact)
      return item
    })
    return data
  },
  async getAll(): Promise<poolDB[]> {
    const store = useLoginStore()
    var data = (await axios.get("get_all_customer", {
      params: {
        token: store.token
      }
    })).data
    data = data.map((item: any) => {
      item.contact = JSON.parse(item.contact)
      return item
    })
    // 将 data.contact 中的奇数项为 contactContent 偶数 为
    return data;
  },
  async editCustomer(params: poolDB) {
    params.contact = JSON.stringify(params.contact)
    const { data } = await axios.get("/edit_customer", {
      params,
    });
    return data;
  },
  async addCustomer(params: poolDB & { token: string }) {
    params.contact = JSON.stringify(params.contact)
    params.token = useLoginStore().token as string
    const { data } = await axios.get("/add_customer", {
      params,
    });
    return data;
  },
  async claim(params: {
    token: string
    cid: number
  }): Promise<any> {
    const { data } = await axios.get("/claim", {
      params,
    });
    return data;
  },
};
