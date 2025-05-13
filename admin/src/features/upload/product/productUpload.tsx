import { UploadIcon } from "lucide-react";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { nanoid } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { addProducts, getCategories, uploadImage } from "@/services";
import { Selector } from "@/common";
import { useMutation, useQueryClient } from "react-query";
import { MoonLoader } from "react-spinners";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";
import { Image } from "@/utils/Image";

interface UploadFoodProp {
  closeModal: () => void;
}

export const UploadFood: React.FC<UploadFoodProp> = ({ closeModal }) => {
  const reference = useRef<HTMLDivElement>();
  const [addFood, setAddFood] = useState<Action.UploadProduct>({
    product: {
      cookingTime: "",
      bannerImg: "",
      description: "",
      id: nanoid(),
      name: "",
      image: "",
      price: "",
      quantity: "",
      tagId: "",
      rating: "0",
     discountPrice: 0 
    },
    collection: "products",
  });
  const [initialCategory, setIntitialCategory] = useState<Ui.Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [coverImageLoading, setCoverImageLoading] = useState<boolean>(false);
  const [productImageLoading, setProductImageLoading] =
    useState<boolean>(false);

  const categories = async () => {
    try {
      const response = await getCategories();
      setIntitialCategory(response);
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(error?.message);
      }
    }
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    type: "bannerImg" | "product"
  ) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    try {
      if (file && file.type.startsWith("image/")) {
        if (type === "bannerImg") {
          setCoverImageLoading(true);
        } else {
          setProductImageLoading(true);
        }

        const image = await uploadImage(file, "products");

        setAddFood((prev) => ({
          ...prev,
          product: {
            ...prev.product,
            [type === "bannerImg"
              ? "bannerImg"
              : "image"]: `${image?.data?.folderName}/${image?.data.filename}`,
          },
        }));
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50 ",
          icon: "error",
          title: "Error",
          message: error?.message,
        });
      }
      toaster({
        icon: "error",
        className: " bg-red-50",
        message: "Unable to upload file",
        title: "Error",
      });
    } finally {
      if (type === "bannerImg") {
        setCoverImageLoading(false);
      } else {
        setProductImageLoading(false);
      }
    }
  };

  const handleImage = async (
    event: ChangeEvent<HTMLInputElement>,
    type: "bannerImg" | "product"
  ) => {
    if (type === "bannerImg") {
      setCoverImageLoading(true);
    } else {
      setProductImageLoading(true);
    }

    const loader = toaster({ icon: "loading", message: "Please wait..." });
    try {
      const file = event.target.files && event.target.files[0];
      const response = await uploadImage(file as File, "products");
      setAddFood((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          [type === "bannerImg"
            ? "bannerImg"
            : "image"]: `${response?.data?.folderName}/${response?.data?.filename}`,
        },
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: " bg-red-50",
          icon: "error",
          message: error.message,
          title: "Error",
        });
      }
    } finally {
      if (type === "bannerImg") {
        setCoverImageLoading(false);
      } else {
        setProductImageLoading(false);
      }
      toast.dismiss(loader);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const coverImageRef = useRef<HTMLInputElement | null>(null);
  const productImageRef = useRef<HTMLInputElement | null>(null);

  const handleClick = async (event: FormEvent) => {
    event.preventDefault();
    if (!addFood)
      return toaster({
        icon: "error",
        title: "Error",
        message: "Product are unavailable",
        className: "bg-red-50",
      });
    setLoading(true);
    const convertOGProduct = {
      collection: addFood.collection,
      product: {
        id: addFood.product.id,
        name: addFood.product.name,
        image: addFood.product.image,
        bannerImg: addFood.product.bannerImg,
        description: addFood.product.description,
        price: parseInt(addFood.product.price as string),
        quantity: parseInt(addFood.product.quantity as string),
        tagId: addFood.product.tagId,
        rating: addFood.product.rating,
        cookingTime: addFood.product.cookingTime,
      },
    };
    try {
      const response = await addProducts(convertOGProduct);

      toaster({
        title: "Product successfully added!",
        message: response?.message,
        className: " bg-green-50",
        icon: "success",
      });
      setAddFood(() => ({
        collection: "products",
        product: {
          id: "",
          image: "",
          coverImg: "",
          description: "",
          name: "",
          price: "",
          quantity: "",
          tagId: "",
          rating: "0",
          cookingTime: "",
        },
      }));
      closeModal();
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          icon: "error",
          title: "Error",
          message: error?.message,
          className: "bg-red-50",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: handleClick,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addFood.collection });
    },
  });

  useEffect(() => {
    categories();
  }, []);

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="relative flex flex-col items-center justify-center w-full h-full gap-5 overflow-auto"
      >
        <h3 className="h-12 sticky border-[var(--dark-border)] tracking-wider overflow-hidden text-center w-full border-b-[1px] text-[var(--dark-text)] text-[20px]">
          Add an item
        </h3>

        <form
          onSubmit={(event) => mutate(event)}
          action=""
          className="sm:w-[600px] h-[60vh] overflow-y-auto w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start"
        >
          {/* First Row */}
          <div className="flex flex-col items-center justify-start w-full gap-5 sm:flex-row">
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Item Name
              </label>
              <input
                required
                type="text"
                onChange={(event) =>
                  setAddFood((prev) => ({
                    ...prev,
                    product: { ...prev.product, name: event.target.value },
                  }))
                }
                placeholder="Pizza"
                className="w-full border-[var(--dark-border)] border-[1px] text-[var(--dark-text)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-2 px-4 rounded"
              />
            </div>
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Price
              </label>
              <input
                required
                type="number"
                onChange={(event) =>
                  setAddFood((prev) => ({
                    ...prev,
                    product: {
                      ...prev.product,
                      price: event.target.value,
                    },
                  }))
                }
                placeholder="Rs. 1,200"
                className="w-full border-[1px] border-[var(--dark-border)] placeholder:text-sm bg-[var(--light-foreground)] outline-none text-[var(--dark-text)] py-2 px-4 rounded"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col items-center justify-start w-full gap-5 sm:flex-row">
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Category
              </label>
              <Selector
                categoryOption={initialCategory?.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                setField={(value) =>
                  setAddFood((prev) => ({
                    ...prev,
                    product: { ...prev.product, tagId: value },
                  }))
                }
              />
            </div>
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Quantity
              </label>
              <div className="w-full py-1 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)]">
                <input
                  required
                  type="number"
                  onChange={(event) =>
                    setAddFood((prev) => ({
                      ...prev,
                      product: {
                        ...prev.product,
                        quantity: event.target.value,
                      },
                    }))
                  }
                  placeholder="Enter Quantity"
                  className="w-full text-[var(--dark-text)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-1.5 px-4 rounded"
                />
              </div>
            </div>
          </div>

          {/* Third Row */}
          <div className="flex flex-col items-center justify-start w-full gap-5 sm:flex-row">
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Cooking Time
              </label>
              <div className="w-full py-1 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)]">
                <input
                  required
                  type="text"
                  onChange={(event) =>
                    setAddFood((prev) => ({
                      ...prev,
                      product: {
                        ...prev.product,
                        cookingTime: event.target.value,
                      },
                    }))
                  }
                  placeholder="eg. 20mins - 30mins"
                  className="w-full text-[var(--dark-text)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-1.5 px-4 rounded"
                />
              </div>
            </div>
            {/* <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Rating
              </label>
              <div className="w-full py-1 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)]">
                <input
                  required
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  onChange={(event) =>
                    setAddFood((prev) => ({
                      ...prev,
                      product: {
                        ...prev.product,
                        rating: event.target.value,
                      },
                    }))
                  }
                  placeholder="Enter rating (0-5)"
                  className="w-full text-[var(--dark-text)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-1.5 px-4 rounded"
                />
              </div>
            </div> */}
          </div>

          {/* Description */}
          <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
            <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
              Description
            </label>
            <textarea
              required
              onChange={(event) =>
                setAddFood((prev) => ({
                  ...prev,
                  product: {
                    ...prev.product,
                    description: event.target.value,
                  },
                }))
              }
              placeholder="Enter product description"
              className="w-full border-[1px] border-[var(--dark-border)] placeholder:text-sm bg-[var(--light-foreground)] outline-none text-[var(--dark-text)] py-2 px-4 rounded min-h-[100px] resize-y"
            />
          </div>

          <div className="w-full flex  justify-between gap-2">
            {/* Cover Image */}
            <div className="w-full flex flex-col items-baseline justify-center gap-2">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Cover Image
              </label>
              {addFood.product.bannerImg ? (
                <div className="w-full overflow-hidden transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px]">
                  <Image
                    className="w-full h-[200px] object-cover"
                    highResSrc={
                      import.meta.env.VITE_API_URL_ASSETS +
                      addFood?.product.bannerImg
                    }
                  />
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "bannerImg")}
                  onClick={() => coverImageRef.current?.click()}
                  className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-16"
                >
                  <input
                    required
                    ref={coverImageRef}
                    onChange={(event) => handleImage(event, "bannerImg")}
                    type="file"
                    className="hidden"
                  />
                  {coverImageLoading ? (
                    <div className="flex flex-col items-center justify-center w-full gap-3">
                      <MoonLoader size={24} color="var(--primary-color)" />
                      <span className="text-sm text-[var(--dark-text)]">
                        Uploading cover image...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full gap-1">
                      <UploadIcon className="size-7 text-[var(--dark-text)]" />
                      <span className="text-sm text-[var(--dark-text)]">
                        Upload cover image or drag and drop
                      </span>
                      <span className="text-[var(--dark-secondary-text)] text-sm">
                        jpg, png upto 10 mb
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Image */}
            <div className="w-full flex flex-col items-baseline justify-center gap-2">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Product Image
              </label>
              {addFood.product.image ? (
                <div className="w-full overflow-hidden transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px]">
                  <Image
                    className="w-full h-[200px] object-cover"
                    highResSrc={
                      import.meta.env.VITE_API_URL_ASSETS +
                      addFood?.product.image
                    }
                  />
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "product")}
                  onClick={() => productImageRef.current?.click()}
                  className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-16"
                >
                  <input
                    required
                    ref={productImageRef}
                    onChange={(event) => handleImage(event, "product")}
                    type="file"
                    className="hidden"
                  />
                  {productImageLoading ? (
                    <div className="flex flex-col items-center justify-center w-full gap-3">
                      <MoonLoader size={24} color="var(--primary-color)" />
                      <span className="text-sm text-[var(--dark-text)]">
                        Upload product image or drag and drop
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full gap-1">
                      <UploadIcon className="size-7 text-[var(--dark-text)]" />
                      <span className="text-sm text-[var(--dark-text)]">
                        Upload product image or drag and drop
                      </span>
                      <span className="text-[var(--dark-secondary-text)] text-sm">
                        jpg, png upto 10 mb
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Special Product Checkbox */}
          <div className="flex  flex-col items-center justify-center gap-4 pl-2">
            <div className="flex items-center justify-center gap-2">
              <input
                onChange={(event) => {
                  if (event.target.checked)
                    setAddFood((prev) => ({ ...prev, collection: "specials" }));
                  else
                    setAddFood((prev) => ({ ...prev, collection: "products" }));
                }}
                type="checkbox"
                id="special-product"
                value={"specials"}
                className="w-[15px] accent-slate-900 cursor-pointer scale-[1.1] h-[15px]"
              />
              <label
                htmlFor="special-product"
                className="text-[16px] cursor-pointer text-[var(--dark-text)]"
              >
                Would you like to mark this as a special product?
              </label>
            </div>
            {addFood.collection === "specials" && (
              <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
                <input
                  onChange={(event) =>
                    setAddFood((prev) => ({
                      ...prev,
                      product: {
                        ...prev.product,
                        discountPrice: parseInt(event.target.value),
                      },
                    }))
                  }
                  type="number"
                  placeholder="eg. 10% off"
                  className="w-full border-[1px] border-[var(--dark-border)] placeholder:text-sm bg-[var(--light-foreground)] outline-none text-[var(--dark-text)] py-2 px-4 rounded"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading || coverImageLoading || productImageLoading}
            type="submit"
            className="w-full flex items-center text-[16px] justify-center gap-3 text-white transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
            {(loading || coverImageLoading || productImageLoading) && (
              <MoonLoader size={18} color="white" />
            )}
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};
