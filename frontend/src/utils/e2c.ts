export default {
  ContactMethod: {
    WeChat: "微信",
    EMail: "邮箱",
    Phone: "手机号",
    Other: "其他",
  },
  Status: {
    Interested: "有意向",
    NotInterested: "无意向",
    Signed: "已签",
  },
  LearnFrom: {
    Friend: "朋友介绍",
    Internet: "网上得知"
  }
} as Record<string,Record<string,string>>;
