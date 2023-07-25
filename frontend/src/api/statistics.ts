import { creationStatisticsDB, signStatisticsDB } from "../../../backend/db/types";
import { Params } from "./../../../backend/routes/api/get_statistics";
import axios from "./axios";

export interface Response {
    code: 0,
    data: {
        creation: creationStatisticsDB[],
        sign: signStatisticsDB[],
        contribution: {
            creation: number,
            sign: number
        }
    }
}

export default async (params: Params): Promise<Response> => {
  return (await axios.get("/get_statistics", { params })).data;
};
