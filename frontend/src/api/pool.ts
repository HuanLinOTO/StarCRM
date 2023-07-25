import { poolDB } from "../../../backend/db/types";
import axios from "./axios";

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
    console.log(data);
    return data;
  },
  async getPublic(): Promise<poolDB[]> {
    return (await axios.get("get_public")).data;
  },
  async getAll(): Promise<poolDB[]> {
    const data = (await axios.get("get_all_customer")).data
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
  async addCustomer(params: poolDB) {
    params.contact = JSON.stringify(params.contact)
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
