import { message } from "antd";

export default class Message {
    static success(text) {
        message.success(text, 5);
    }

    static error(text) {
        message.error(text, 5);
    }

    static warning(text) {
        message.warning(text, 5);
    }
}
