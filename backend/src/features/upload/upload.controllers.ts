import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { compressAndSaveImage } from "../../utils/storage/compressImage.js";
import { sanitizeFolderName } from "../../helpers/sanitize/sanitizeFolderName.js";
// import { uploadImageToFirebase } from "../../utils/storage/uploadImage.js";
// import fs from "fs";

export const Upload = asyncHandler(async (req: Request, res: Response) => {
  const { file } = req;
  let response: API.ApiResponse;
  if (!file) {
    response = {
      data: null,
      message: "No file found.",
      success: false,
      status: 400,
    };
    return res.status(400).json(response);
  }

  if (!file.mimetype.startsWith("image/")) {
    response = {
      data: null,
      message: "Only image files are allowed.",
      success: false,
      status: 400,
    };
    return res.status(400).json(response);
  }
  const filePath = file.path;
  const folderName = sanitizeFolderName(req.body.folderName || "default");

  await compressAndSaveImage(filePath, folderName, file.filename);

  response = {
    data: {
      filename: file.filename,
      folderName: folderName,
    },
    message: "Image uploaded successfully.",
    success: true,
    status: 200,
  };
  return res.status(200).json(response);
});
