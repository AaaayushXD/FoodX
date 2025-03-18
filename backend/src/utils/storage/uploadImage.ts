import fs from "fs";
import { storage } from "../../firebase/index.js";

const uploadImageToFirebase = async (
  folderName: string,
  filePath: string
): Promise<string> => {
  const bucket = storage.bucket();

  try {
    const metaData = {
      contentType: "image/png",
    };

    const destinationPath = `${folderName}/${filePath.split("/").pop()}`;
    const [uploadedData] = await bucket.upload(filePath, {
      destination: destinationPath,
      metadata: metaData,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uploadedData.name}`;
    return publicUrl;
  } catch (error) {
    fs.unlinkSync(filePath);
    throw new Error("Unable to upload image. " + error);
  }
};

export { uploadImageToFirebase };
