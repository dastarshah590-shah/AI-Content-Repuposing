import {
  createClient,
  createTeamMember,
  listClients,
  listTeamMembers
} from "../services/projectStore.js";
import { stripUnsafeHtml } from "../utils/validators.js";

export function getWorkspace(req, res) {
  res.json({
    success: true,
    clients: listClients(req.userId),
    teamMembers: listTeamMembers(req.userId)
  });
}

export function postClient(req, res, next) {
  try {
    const client = createClient(req.userId, {
      name: stripUnsafeHtml(req.body.name),
      industry: stripUnsafeHtml(req.body.industry),
      notes: stripUnsafeHtml(req.body.notes)
    });
    res.status(201).json({ success: true, client });
  } catch (error) {
    next(error);
  }
}

export function postTeamMember(req, res, next) {
  try {
    const member = createTeamMember(req.userId, {
      name: stripUnsafeHtml(req.body.name),
      email: stripUnsafeHtml(req.body.email),
      role: stripUnsafeHtml(req.body.role || "Editor")
    });
    res.status(201).json({ success: true, teamMember: member });
  } catch (error) {
    next(error);
  }
}