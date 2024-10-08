import dayjs from "dayjs";
import { body, param, query } from "express-validator";

export function check(key: string) {
    const [target, ...name] = key.split('');
    switch (target) {
        case '?': return query(name);
        case ':': return param(name);
        default: return body(key);
    }
}

export function isValidDate(value: string) {
    return dayjs(value, 'YYYY-MM-DD', true).isValid();;
};