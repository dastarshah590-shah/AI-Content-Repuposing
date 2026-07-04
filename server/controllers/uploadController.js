import { addUploadedFile, getUsage } from "../services/projectStore.js";
import { assertSupportedMedia } from "../utils/validators.js";

export function uploadFile(req, res, next) {
  try {
    assertSupportedMedia(req.file);

    const usage = getUsage(req.userId);
    const mediaLimitMb = usage.limits.mediaUploadMb;

    if (!mediaLimitMb) {
      return res.status(403).json({
        success: false,
        message: "Your current plan does not include media upload. Switch plans to transcribe audio or video."
      });
    }

    if (req.file.size > mediaLimitMb * 1024 * 1024) {
      return res.status(413).json({
        success: false,
        message: `Your plan allows media files up to ${mediaLimitMb} MB.`
      });
    }

    const uploadedFile = addUploadedFile({
      userId: req.userId,
      projectId: req.body.projectId,
      file: req.file
    });

    res.status(201).json({
      success: true,
      fileId: uploadedFile.id,
      fileName: uploadedFile.fileName,
      fileType: uploadedFile.fileType,
      fileSize: uploadedFile.fileSize,
      transcriptStatus: uploadedFile.transcriptStatus
    });
  } catch (error) {
    next(error);
  }
}