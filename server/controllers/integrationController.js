import {
  connectIntegration,
  disconnectIntegration,
  listIntegrations,
  listPublishQueue,
  queueOutputForPublishing,
  recordExport
} from "../services/projectStore.js";
import { stripUnsafeHtml } from "../utils/validators.js";

export function getIntegrations(req, res) {
  res.json({
    success: true,
    integrations: listIntegrations(req.userId),
    publishQueue: listPublishQueue(req.userId)
  });
}

export function postConnectIntegration(req, res, next) {
  try {
    const integration = connectIntegration(req.userId, req.params.integrationId);
    res.json({ success: true, integration });
  } catch (error) {
    next(error);
  }
}

export function postDisconnectIntegration(req, res) {
  const integration = disconnectIntegration(req.userId, req.params.integrationId);
  res.json({ success: true, integration });
}

export function postQueueOutput(req, res, next) {
  try {
    const queueItem = queueOutputForPublishing(req.userId, {
      outputId: stripUnsafeHtml(req.body.outputId),
      integrationId: stripUnsafeHtml(req.body.integrationId),
      scheduledFor: stripUnsafeHtml(req.body.scheduledFor)
    });
    res.status(201).json({ success: true, queueItem });
  } catch (error) {
    next(error);
  }
}

export function postExportEvent(req, res) {
  res.json({
    success: true,
    usage: recordExport(req.userId)
  });
}