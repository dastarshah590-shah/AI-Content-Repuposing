import { Router } from "express";
import {
  getBrandProfiles,
  postBrandProfile,
  putBrandProfile,
  removeBrandProfile
} from "../controllers/brandController.js";

export const brandRoutes = Router();

brandRoutes.get("/brand-profiles", getBrandProfiles);
brandRoutes.post("/brand-profiles", postBrandProfile);
brandRoutes.put("/brand-profiles/:profileId", putBrandProfile);
brandRoutes.delete("/brand-profiles/:profileId", removeBrandProfile);