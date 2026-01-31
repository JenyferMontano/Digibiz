
import { startProcess, getProcessProgress, runAgent } from "../services/services.js";

export async function createProcessController(req, res) {
    try {
        const { businessId } = req.body;

        if (!businessId) {
            return res.status(400).json({
                error: "businessId is requeried!"
            })
        }

        const doc = await startProcess(businessId);

        res.json({
            processId: doc._id,
            status: doc.status,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
};

export async function getProgress(req, res) {
    try {
        const { businessId } = req.query;

        if (!businessId) {
            return res.status(400).json({
                error: "Not Found"
            })
        };

        const doc = await getProcessProgress(businessId);
        res.json({ doc })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}