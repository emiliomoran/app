export default class Utils {
    static parseToCents(value) {
        return value * 100;
    }

    static parseToDollars(value) {
        return value / 100;
    }
}
