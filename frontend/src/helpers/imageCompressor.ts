type CompressImageOptions = {
  maxWidth: number;
  maxHeight: number;
  quality: number; // range from 0 to 1, where 1 is the highest quality
};

export function compressImage(
  file: File,
  options: CompressImageOptions
): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Create a canvas element to resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Calculate the new dimensions
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > options.maxWidth || height > options.maxHeight) {
          if (width > height) {
            width = options.maxWidth;
            height = width / aspectRatio;
          } else {
            height = options.maxHeight;
            width = height * aspectRatio;
          }
        }

        // Set canvas size to the calculated dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to a Blob
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Image compression failed"));
          },
          "image/jpeg",
          options.quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
