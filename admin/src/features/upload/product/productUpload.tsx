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
import { addProducts, addLogs, getCategories, uploadImage } from "@/services";
import { Selector } from "@/common";
import { useMutation, useQueryClient } from "react-query";
import { MoonLoader } from "react-spinners";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";

interface UploadFoodProp {
  closeModal: () => void;
}
export const UploadFood: React.FC<UploadFoodProp> = ({ closeModal }) => {
  const reference = useRef<HTMLDivElement>();
  const [addFood, setAddFood] = useState<Action.UploadProduct>({
    product: {
      id: nanoid(),
      name: "",
      image: "",
      price: "",
      quantity: "",
      tagId: "",
    },
    collection: "products",
  });
  const [initialCategory, setIntitialCategory] = useState<Ui.Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    try {
      if (file && file.type.startsWith("image/")) {
        setLoading(true);
        // const compressedImage = await compressImage(file, {
        //   maxWidth: 150,
        //   maxHeight: 150,
        //   quality: 0.7,
        // });
        const imageURL = URL.createObjectURL(file as Blob);
        setAddFood((prev) => ({
          ...prev,
          product: { ...prev.product, image: imageURL },
        }));

        const image = await uploadImage(file, "products");
        setAddFood((prev) => ({
          ...prev,
          product: {
            ...prev.product,
            image: `${image?.data?.folderName}/${image?.data.filename}`,
          },
        }));

        // storeImageInFirebase(file, {
        //   folder: "products",
        // }).then((url) =>
        //   setAddFood((prev) => ({
        //     ...prev,
        //     product: { ...prev.product, image: url },
        //   }))
        // );
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
      setLoading(false);
    }
  };

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const loader = toaster({ icon: "loading", message: "Please wait..." });
    try {
      const file = event.target.files && event.target.files[0];
      const response = await uploadImage(file as File, "products");
      setAddFood((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          image: `${response?.data?.folderName}/${response?.data?.filename} `,
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
      setLoading(false);
      toast.dismiss(loader);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = async (event: FormEvent) => {
    event.preventDefault();
    if (!addFood) return toast.error("Product are unavailable");
    const convertOGProduct = {
      collection: addFood.collection,
      product: {
        id: addFood.product.id,
        name: addFood.product.name,
        image: addFood.product.image,
        price: parseInt(addFood.product.price as string),
        quantity: parseInt(addFood.product.quantity as string),
        tagId: addFood.product.tagId,
      },
    };
    try {
      setLoading(true);
      const response = await addProducts(convertOGProduct);
      await addLogs({
        action: "create",
        detail: ` Product :  ${addFood.product.id}`,
        date: new Date(),
      });
      toaster({
        title: "Product successfully added!",
        message: response?.message,
        className: " bg-green-50",
        icon: "success",
      });
    } catch (error) {
      toast.error("Error while adding product ");
      throw new Error("Error while uploading products" + error);
    } finally {
      closeModal();
      setLoading(false);
      setAddFood(() => ({
        collection: "products",
        product: {
          id: "",
          image: "",
          name: "",
          price: "",
          quantity: "",
          tagId: "",
        },
      }));
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
        <h3 className=" h-12 sticky border-[var(--dark-border)] tracking-wider  overflow-hidden  text-center  w-full border-b-[1px] text-[var(--dark-text)] text-[20px]">
          Add an item
        </h3>

        <form
          onSubmit={(event) => mutate(event)}
          action=""
          className="sm:w-[600px]   w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <div className="flex flex-col items-center justify-start w-full gap-5 sm:flex-row ">
            {" "}
            <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
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
            <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5  text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
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
                className="w-full border-[1px] border-[var(--dark-border)] placeholder:text-sm bg-[var(--light-foreground)]  outline-none text-[var(--dark-text)] py-2 px-4 rounded"
              />
            </div>
          </div>
          {/* Second Row */}
          <div className="flex flex-col items-center justify-start w-full gap-5 sm:flex-row">
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
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
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Quantity
              </label>
              <div className="w-full py-1 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)] ">
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
          {addFood.product.image ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px]">
              {" "}
              <img
                className="w-full h-[230px] object-fill"
                src={addFood?.product.image as string}
              />
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-20"
            >
              <input
                required
                ref={fileRef as any}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleImage(event)
                }
                type="file"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center w-full gap-1 bottom-10">
                <UploadIcon className="size-7 text-[var(--dark-text)] " />
                <span className="text-sm text-[var(--dark-text)] ">
                  Upload a file or drag and drop
                </span>
                <span className="text-[var(--dark-secondary-text)] text-sm ">
                  jpg,png upto 10 mb
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 pl-2 ">
            <input
              onChange={(event) => {
                if (event.target.checked)
                  setAddFood((prev) => ({ ...prev, collection: "specials" }));
                else
                  setAddFood((prev) => ({ ...prev, collection: "products" }));
              }}
              type="checkbox"
              id="1245"
              value={"specials"}
              className="w-[15px] accent-slate-900 cursor-pointer scale-[1.1] h-[15px] "
            />
            <label
              htmlFor="1245"
              className="text-[16px] cursor-pointer text-[var(--dark-text)] "
            >
              {" "}
              Would you like to mark this as a special product ?
            </label>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center text-[16px] justify-center gap-3 text-white transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] "
          >
            Save
            {loading && <MoonLoader size={18} color="white" />}
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};
