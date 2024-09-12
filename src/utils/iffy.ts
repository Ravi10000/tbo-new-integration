export function iffy(object: { [key: string]: any }) {
    const allKeys = Object.keys(object);
    const result = {};
    allKeys.forEach((key) => {
        if (object[key] != null) result[key] = object[key];
    });
    return result;
};