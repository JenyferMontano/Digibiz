import { CloudantV1 } from "@ibm-cloud/cloudant";
import { IamAuthenticator } from "ibm-cloud-sdk-core";

export const cloudant = new CloudantV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.CLOUDANT_API_KEY!,
  }),
  serviceUrl: process.env.CLOUDANT_URL!,
});

export async function createProcess(doc: any) {
  return cloudant.postDocument({
    db: process.env.CLOUDANT_DB_NAME!,
    document: doc,
  });
}

export async function findBusinessProcess(businessId: string) {
  const response = await cloudant.postFind({
    db: process.env.CLOUDANT_DB_NAME!,
    selector: {
      businessId,
      type: 'process'
    },
    limit: 1,
  });

  return response.result.docs[0] || null;
}

export async function updateProcess(docId: string, update: any) {
  try {
    const currentDoc = await cloudant.getDocument({
      db: process.env.CLOUDANT_DB_NAME!,
      docId,
    });
    
    const updatedDoc = {
      ...currentDoc.result,
      ...update,
      _rev: currentDoc.result._rev,
    };
    
    return cloudant.putDocument({
      db: process.env.CLOUDANT_DB_NAME!,
      docId,
      document: updatedDoc,
    });
  } catch (error: any) {
    if (error.status === 404) {
      return cloudant.postDocument({
        db: process.env.CLOUDANT_DB_NAME!,
        document: update,
      });
    }
    throw error;
  }
}


