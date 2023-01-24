export class Util {
  static getDateString(date: Date, seperator = '-') {
    return date.getFullYear() + seperator + (date.getMonth() + 1 + '').padStart(2, '0') + seperator + (date.getDate() + '').padStart(2, '0');
  }

  static isEquals(a: unknown, b: unknown) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
