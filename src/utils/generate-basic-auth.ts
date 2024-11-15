export function generateBasicAuth(username: string, password: string): string {
    return `Basic ${btoa(`${username}:${password}`)}`
}