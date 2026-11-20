import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

const credential = new ClientSecretCredential(
    process.env.MS_TENANT_ID,
    process.env.MS_CLIENT_ID,
    process.env.MS_CLIENT_SECRET
);

const graphClient = Client.initWithMiddleware({
    authProvider: {
        getAccessToken: async () => {
            const tokenResponse = await credential.getToken(
                "https://graph.microsoft.com/.default"
            );
            if (!tokenResponse?.token) {
                throw new Error("Unable to acquire Microsoft Graph Token")
            }
            return tokenResponse.token;
        }
    }
});

export async function sendemail(to, subject, body) {
    if (!to || !body || !subject ) {
        throw new Error ("Email recipient, subject and body are required");
    }
    const message = {
        subject, body: {
            contentType: "Text",
            content: body
        },
        toRecipients: [
            {emailAddress: { address: to}}
        ]
    };
    await graphClient
        .api(`/users/${encodeURIComponent(process.env.MAIL_FROM)}/sendMail`)
        .post({message, saveToSentItem: true });
    return true;
}