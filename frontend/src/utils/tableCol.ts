import { h } from "vue";
import { ElTag, ElTooltip } from "element-plus";
import { dayjs } from "element-plus";


export default {
  customer: [
    { key: "id", dataKey: "id", title: "ID", width: 150 },
    { key: "name", dataKey: "name", title: "公司全称", width: 150 },
    // {
    //   key: "contactMethod",
    //   dataKey: "contactMethod",
    //   title: "联系方式",
    //   width: 150,
    // },
    // {
    //   key: "contactContent",
    //   dataKey: "contactContent",
    //   title: "联系内容",
    //   width: 150,
    // },
    // { key: "owner", dataKey: "owner", title: "所有者", width: 150 },
    {
      key: "status",
      dataKey: "status",
      title: "客户状态",
      width: 150,
      align: "center",
      cellRenderer: ({ cellData: name }: Record<string, string>) =>
        h(
          ElTag,
          {
            type: {
              有意向: "",
              无意向: "warning",
              已签: "success",
            }[name as string] as "warning" | "success",
          },
          name
        ),
    },
    { key: "learnFrom", dataKey: "learnFrom", title: "来源", width: 150 },
    {
      key: "lastOperateTime",
      dataKey: "lastOperateTime",
      title: "最后操作时间",
      width: 240,
      cellRenderer: ({ cellData: date }: Record<string, string>) => {
        return h(
          ElTooltip,
          {
            content: dayjs(date).format("YYYY/MM/DD HH:mm:ss"),
          },
          h("span", {}, dayjs(date).format("YYYY/MM/DD HH:mm:ss"))
        );
      },
    }
  ],
  user: [
    { key: "id", dataKey: "id", title: "ID", width: 150 },
    { key: "name", dataKey: "name", title: "用户名", width: 150 },
    { key: "password", dataKey: "password", title: "密码", width: 150 },
    { key: "token", dataKey: "token", title: "token", width: 150 },
    { key: "role", dataKey: "role", title: "地位", width: 150 },
  ]
};