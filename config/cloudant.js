import { CloudantV1 } from "@ibm-cloud/cloudant";
import { IamAuthenticator } from "ibm-cloud-sdk-core"
import dotenv from "dotenv";

dotenv.config();

export const cloudant = new CloudantV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.CLOUDANT_API_KEY,
    }),
    serviceUrl: process.env.CLOUDANT_URL,
});

