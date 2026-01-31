import { cloudant } from "../config/cloudant.js"
import dotenv from 'dotenv';

dotenv.config();

export async function createProcess(doc) {
    return cloudant.postDocument({
        db: process.env.CLOUDANT_DB,
        document: doc,
    })
};

export async function findBusinessProcess(businessId) {
    const response = await cloudant.postFind({
        db: process.env.CLOUDANT_DB,
        selector: {
            businessId,
            type: 'process'
        },
        limit: 1,
    });

    return response.result.docs[0] || null;
};

export async function updateProcess(docId, update) {
    return cloudant.putDocument({
        db: process.env.CLOUDANT_DB,
        docId,
        document: update,
    })
}