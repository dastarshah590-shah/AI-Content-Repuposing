import {
  getUsage,
  listPlans,
  updateUserPlan
} from "../services/projectStore.js";
import { stripUnsafeHtml } from "../utils/validators.js";

export function getPlans(_req, res) {
  res.json({
    success: true,
    plans: listPlans()
  });
}

export function putPlan(req, res, next) {
  try {
    const user = updateUserPlan(req.userId, stripUnsafeHtml(req.body.plan));
    res.json({
      success: true,
      user,
      usage: getUsage(user.id)
    });
  } catch (error) {
    next(error);
  }
}

export function getUsageSummary(req, res) {
  res.json({
    success: true,
    usage: getUsage(req.userId)
  });
}