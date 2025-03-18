import multer from "multer";
import fs from "fs";
import { generateRandomId } from "../../utils/random/randomId.js";

const uploadDir = "./public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, uploadDir);
  },
  filename: function (_, file, cb) {
    const date = new Date();
    const timeStamp = date.toISOString().replace(/:/g, "-");
    cb(null, `${timeStamp}-${generateRandomId()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
