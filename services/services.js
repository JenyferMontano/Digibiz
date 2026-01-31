import crypto from "crypto";
import {
  createProcess,
  findBusinessProcess,
  updateProcess,
} from "../lib/utils.js";
import { generateText } from "../config/watson.js";

export async function startProcess(businessId) {
  const business = await findBusinessProcess(businessId);
  if (business) return business;

  const doc = {
    _id: crypto.randoumUUID(),
    type: "process",
    businessId,
    status: "started",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [],
    meta: {
      progress: 0,
    },
  };

  await createProcess(doc);
  return doc;
}

export async function getProcessProgress(businessId) {
  const doc = await findBusinessProcess(businessId);

  if (!doc) {
    throw new Error("Process Not Found");
  }

  return doc;
}

export async function runAgent(businessId, prompt) {
  const doc = await findBusinessProcess(businessId);

  if (!doc) {
    throw new Error("Process Not Found");
  }

  const text = await generateText(prompt);

  doc.steps.push({
    step: "watson",
    output: text,
    createdAt: new Date.toISOString(),
  });
  doc.meta.progress = Math.min(100, doc.meta.progress + 10);
  doc.updatedAt = new Date().toISOString();

  await updateProcess(doc._id, doc);
  return doc;
}
