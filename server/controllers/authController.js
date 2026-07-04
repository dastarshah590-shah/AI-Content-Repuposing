import {
  authenticateUser,
  createUser,
  getUsage,
  getUser,
  updateUserProfile
} from "../services/projectStore.js";
import { stripUnsafeHtml } from "../utils/validators.js";

export function getSession(req, res) {
  res.json({
    success: true,
    user: req.user,
    usage: getUsage(req.userId)
  });
}

export function postLogin(req, res, next) {
  try {
    const user = authenticateUser({
      email: stripUnsafeHtml(req.body.email),
      password: String(req.body.password || "")
    });

    res.json({
      success: true,
      user,
      usage: getUsage(user.id)
    });
  } catch (error) {
    next(error);
  }
}

export function postRegister(req, res, next) {
  try {
    const user = createUser({
      email: stripUnsafeHtml(req.body.email),
      name: stripUnsafeHtml(req.body.name),
      password: String(req.body.password || "")
    });

    res.status(201).json({
      success: true,
      user,
      usage: getUsage(user.id)
    });
  } catch (error) {
    next(error);
  }
}

export function putProfile(req, res, next) {
  try {
    const user = updateUserProfile(req.userId, {
      name: stripUnsafeHtml(req.body.name),
      email: stripUnsafeHtml(req.body.email)
    });

    res.json({
      success: true,
      user,
      usage: getUsage(user.id)
    });
  } catch (error) {
    next(error);
  }
}

export function postLogout(req, res) {
  res.json({
    success: true,
    user: getUser("user_demo")
  });
}