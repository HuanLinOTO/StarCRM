import { Contact } from "../db/types";

export default function (data: any): any {
    const result: any = { ...data };

    // Check if 'contact' keys are present and convert them into an array of objects
    if (
        data.hasOwnProperty("contact[0][contactMethod]") &&
        data.hasOwnProperty("contact[0][contactContent]")
    ) {
        const contactArray: Contact[] = [];
        let i = 0;

        while (
            data.hasOwnProperty(`contact[${i}][contactMethod]`) &&
            data.hasOwnProperty(`contact[${i}][contactContent]`)
        ) {
            const contact: Contact = {
                // @ts-ignore
                contactMethod: data[`contact[${i}][contactMethod]`],
                contactContent: data[`contact[${i}][contactContent]`],
            };

            contactArray.push(contact);
            i++;
        }

        // Replace the original contact keys with the parsed array
        result.contact = contactArray;
    }
    // 移除 result 中 contact[ 开头的属性
    for (const key in result) {
        if (key.startsWith("contact[")) {
            delete result[key];
        }
    }
    // result.contact = result.contact.map(item => JSON.stringify(item))
    return result;
}
