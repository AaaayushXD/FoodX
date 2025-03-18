import fs from "fs";
import sharp from "sharp";
import path from "path";

export const compressAndSaveImage = async (
  tempFilePath: string,
  folder: string,
  fileName: string
): Promise<string> => {
  const folderPath = path.join("uploads", folder);
  const finalFilePath = path.join(folderPath, fileName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  await sharp(tempFilePath)
    .resize(800, 800, { fit: "inside" })
    .jpeg({ quality: 80 })
    .png({ quality: 80 })
    .toFile(finalFilePath);

  fs.unlinkSync(tempFilePath);

  return finalFilePath;
};
