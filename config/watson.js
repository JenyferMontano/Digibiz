import dotenv from "dotenv";
import { IamAuthenticator } from "@ibm-cloud/cloudant";
import { WatsonXAI } from "@ibm-cloud/watsonx-ai";

dotenv.config();

const watson = new WatsonXAI({
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSONX_API_KEY
    }),
    serviceUrl: process.env.WATSONX_URL
});

export async function generateText(prompt) {
    const response = await watson.generateText({
        modelId: "ibm/granite-13b-instruct",
        input: prompt,
        parameters: {
            max_new_tokens: 400,
            temperature: 0.2
        }
    });

    return response.result.results[0].generated_text;
}