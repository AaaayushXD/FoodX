import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./index";
const storeImageInFirebase = async (image: File, folder: Common.ImageFolder

) => {
  if (!image) throw new Error("No image Found.");
  try {
    const imageRef = ref(storage, `${folder}/${image.name}`);

    await uploadBytes(imageRef, image);
    const imageUrl = getDownloadURL(imageRef).then((url) => url);
    return imageUrl;
  } catch (error) {
    throw new Error("Error while uploading image.");
  }
};

export { storeImageInFirebase };
