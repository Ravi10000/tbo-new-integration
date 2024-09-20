import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";
export async function getTBOAuthToken(username: string, password: string, env: "TEST" | "LIVE") {
    try {
        const { data } = await TBO.post(TBO_ENDPOINTS[env].AUTHENTICATE, {
            ClientId: "ApiIntegrationNew",
            UserName: username,
            Password: password,
            EndUserIp: process.env.TBO_END_USER_IP || "192.168.1.75",
        });
        return { tokenId: data.TokenId };
    } catch (error: any) {
        console.log({ error });
        return { error: error.message }
    }
}