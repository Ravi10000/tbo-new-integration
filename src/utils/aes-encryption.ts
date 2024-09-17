import crypto from 'crypto';

// const algorithm = 'aes-256-cbc';
// const key = process.env.CREDENTIAL_32_BIT_SECRET_KEY ?? "";
// const iv = crypto.randomBytes(16);

// const cipher = crypto.createCipheriv(algorithm, key, iv);

// let encrypted = cipher.update('Hello World', 'utf8', 'hex');
// encrypted += cipher.final('hex');

// const decipher = crypto.createDecipheriv(algorithm, key, iv);

// let decrypted = decipher.update(encrypted, 'hex', 'utf8');
// decrypted += decipher.final('utf8');

// console.log('Original text: ', 'Hello World');
// console.log('Encrypted text: ', encrypted);
// console.log('Decrypted text: ', decrypted);
if (!process.env.CREDENTIAL_16_BIT_IV || !process.env.CREDENTIAL_32_BIT_SECRET_KEY)
    throw new Error("encryption secret or iv missing")

const algorithm = 'aes-256-cbc';
const key = process.env.CREDENTIAL_32_BIT_SECRET_KEY;
const iv = process.env.CREDENTIAL_16_BIT_IV;
export function encrypt(text: string) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
export function decrypt(encrypted: string) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}