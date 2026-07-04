import { getUser } from "../services/projectStore.js";

export function attachUser(req, _res, next) {
  const headerUserId = req.headers["x-user-id"];
  const queryUserId = req.query?.userId;
  req.user = getUser(headerUserId || queryUserId);
  req.userId = req.user.id;
  next();
}