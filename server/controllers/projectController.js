import {
  createProject,
  getProjectDetails,
  listProjects
} from "../services/projectStore.js";
import { stripUnsafeHtml } from "../utils/validators.js";

export function getProjects(req, res) {
  res.json({
    success: true,
    projects: listProjects(req.userId)
  });
}

export function getProject(req, res) {
  const details = getProjectDetails(req.params.projectId, req.userId);

  if (!details) {
    return res.status(404).json({
      success: false,
      message: "Project was not found."
    });
  }

  res.json({
    success: true,
    ...details
  });
}

export function postProject(req, res) {
  const title = stripUnsafeHtml(req.body.title || "Untitled Content");
  const sourceType = stripUnsafeHtml(req.body.sourceType || "text");
  const sourceContent = stripUnsafeHtml(req.body.sourceContent || "");
  const clientId = stripUnsafeHtml(req.body.clientId || "");
  const brandProfileId = stripUnsafeHtml(req.body.brandProfileId || "");

  if (!title || !sourceType) {
    return res.status(400).json({
      success: false,
      message: "Project title and source type are required."
    });
  }

  const project = createProject({
    userId: req.userId,
    title,
    sourceType,
    sourceContent,
    clientId,
    brandProfileId
  });

  res.status(201).json({
    success: true,
    projectId: project.id,
    project
  });
}