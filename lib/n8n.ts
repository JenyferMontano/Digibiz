import axios from "axios";

export async function n8nTrigger(event:string, payload: any) {
    if (!process.env.NEXT_N8N_WEBHOOK) {
        return null
    };

    return axios.post(process.env.NEXT_N8N_WEBHOOK, {
        event,
        payload
    });
}