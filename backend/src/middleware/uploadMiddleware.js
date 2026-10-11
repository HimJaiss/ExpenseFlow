import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(here, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const fileFilter = (_req, file, cb) => {
  if (["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PNG, JPG, or WEBP signature images are accepted."));
};
export const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
