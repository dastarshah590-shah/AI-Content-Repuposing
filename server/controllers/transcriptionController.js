import {
  getUploadedFile,
  recordTranscription,
  updateUploadedFile
} from "../services/projectStore.js";
import { transcribeAudio } from "../services/transcriptionService.js";

export async function transcribeFile(req, res, next) {
  try {
    const uploadedFile = getUploadedFile(req.body.fileId, req.userId);

    if (!uploadedFile) {
      return res.status(404).json({
        success: false,
        message: "Uploaded file was not found."
      });
    }

    updateUploadedFile(uploadedFile.id, { transcriptStatus: "processing" }, req.userId);
    const transcript = await transcribeAudio(uploadedFile.filePath);
    updateUploadedFile(
      uploadedFile.id,
      {
        transcriptStatus: "completed",
        transcript
      },
      req.userId
    );
    const usage = recordTranscription(req.userId);

    res.json({
      success: true,
      transcript,
      usage
    });
  } catch (error) {
    if (req.body?.fileId) {
      try {
        updateUploadedFile(req.body.fileId, { transcriptStatus: "failed" }, req.userId);
      } catch {
        // Keep the original error.
      }
    }
    next(error);
  }
}