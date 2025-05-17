/* eslint-disable no-unsafe-optional-chaining */
import { useCallback, useEffect, useState } from "react";
import { bulkDeleteOfProduct, deleteProduct, addLogs } from "@/services";
import { FoodTable } from "@/components";
import { Modal, Button, DeleteButton, Delete } from "@/common";
import { UpdateFood, UploadFood } from "@/features";
import toast from "react-hot-toast";
import { ApiError, debounce } from "@/helpers";
import { useNormalProuducts, useSpecialProducts } from "@/hooks";
import { Icons, toaster } from "@/utils";

export const AllProductAnalytics = () => {
  const { data: specialProducts, isLoading: specialLoading } =
    useSpecialProducts();
  const { data: normalProducts, isLoading: normalLoading } =
    useNormalProuducts();

  const [fetchedProducts, setFetchedProducts] = useState<Ui.Product[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [id, setId] = useState<string>();
  const [type, setType] = useState<"specials" | "products">();
  const [filter, setFilter] = useState<{
    typeFilter?: { type?: "products" | "specials"; id?: string };
    sortFilter?: { sort?: string; id?: string };
  }>();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [modalData, setModalData] = useState<Ui.Product>();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 10 });
  const [isUpload, setIsUpload] = useState<boolean>(true);
  const [bulkSelectedProduct, setBulkSelectedProduct] = useState<
    {
      category?: "specials" | "products";
      id?: string;
    }[]
  >([]);

  useEffect(() => {
    if (!specialLoading && !normalLoading) {
      setFetchedProducts([
        ...(normalProducts as unknown as Ui.Product[]),
        ...(specialProducts as Ui.Product[]),
      ]);
    }
  }, [normalLoading, normalProducts, specialLoading, specialProducts]);

  //Sorting
  const handleTypeCheck = async (
    isChecked: boolean,
    value: "specials" | "products",
    id: string
  ) => {
    if (!isChecked)
      return setFilter((prev) => ({
        ...prev,
        typeFilter: { type: undefined, id: undefined },
      }));
    setFilter((prev) => ({ ...prev, typeFilter: { type: value, id: id } }));
  };

  const handleSortCheck = async (
    isChecked: boolean,
    value: "price" | "orders" | "revenue",
    id: string
  ) => {
    if (!isChecked)
      return setFilter((prev) => ({
        ...prev,
        sortFilter: { id: undefined, sort: undefined },
      }));
    setFilter((prev) => ({ ...prev, sortFilter: { id: id, sort: value } }));
  };

  useEffect(() => {
    let filteredProducts = fetchedProducts;

    // Apply filtering
    if (filter?.typeFilter?.type === "products") {
      filteredProducts = normalProducts as unknown as Ui.Product[]
    } else if (filter?.typeFilter?.type === "specials") {
      filteredProducts = specialProducts as Ui.Product[];
    } else if (normalProducts && specialProducts) {
      filteredProducts = [
        ...(normalProducts as unknown as Ui.Product[]),
        ...(specialProducts as Ui.Product[]),
      ];
    }

    // Apply sorting
    if (
      filter?.sortFilter?.sort &&
      (sortOrder === "asc" || sortOrder === "desc")
    ) {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        const aValue = a[filter?.sortFilter?.sort as keyof Ui.Product];
        const bValue = b[filter?.sortFilter?.sort as keyof Ui.Product];

        if (sortOrder === "asc") {
          return typeof aValue === "number" && typeof bValue === "number"
            ? aValue - bValue
            : typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue)
            : 0;
        } else {
          return typeof aValue === "number" && typeof bValue === "number"
            ? bValue - aValue
            : typeof aValue === "string" && typeof bValue === "string"
            ? bValue.localeCompare(aValue)
            : 0;
        }
      });
    }

    setFetchedProducts(filteredProducts);
  }, [filter, sortOrder, normalProducts, specialProducts]);

  const handleChange = async (value: string) => {
    if (value.length <= 0)
      return setFetchedProducts([
        ...(normalProducts as unknown as Ui.Product[]),
        ...(specialProducts as Ui.Product[]),
      ] as Ui.Product[]);

    const filterProducts = (await searchProducts(value)) as Ui.Product[];
    setFetchedProducts(filterProducts);
  };

  const searchProducts = async (value: string) => {
    if (!specialLoading && !normalLoading) {
      const filterProducts = [
        ...(normalProducts as  unknown as Ui.Product[]),
        ...(specialProducts as  unknown as Ui.Product[]),
      ]?.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      return filterProducts;
    }
  };

  const debounceSearch = useCallback(debounce(handleChange, 200), [
    normalProducts,
    specialProducts,
  ]);

  const handleSelectedDelete = async () => {
    const toastLoader = toast.loading("Deleting products...");
    try {
      // Separate products into specials and normal products
      const { specials, products } = bulkSelectedProduct.reduce<{
        specials: string[];
        products: string[];
      }>(
        (acc, product) => {
          if (product.category === "specials") {
            acc.specials.push(product.id as string);
          } else if (product.category === "products") {
            acc.products.push(product.id as string);
          }
          return acc;
        },
        { specials: [], products: [] }
      );
      if (specials.length > 0) {
        await bulkDeleteOfProduct({ category: "specials", ids: specials });
      }

      // Perform bulk delete for normal products
      if (products.length > 0) {
        await bulkDeleteOfProduct({ category: "products", ids: products });
      }
      toast.dismiss(toastLoader);
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `Delete Product : specials:${JSON.stringify(
          specials
        )}, products : ${JSON.stringify(products)} `,
      });
      const refreshProducts = fetchedProducts?.filter((product) => {
        return !specials.includes(product.id) && !products.includes(product.id);
      });

      setFetchedProducts(refreshProducts);
      toast.success("Successfully deleted");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Unable to delete...");

      throw new Error("Error deleting products:" + error);
      // Handle the error appropriately, e.g., show a notification to the user
    }
    setIsBulkDelete(false);
  };

  const handleDelete = async (id: string, type: "specials" | "products") => {
    const toastLoader = toaster({
      icon: "loading",
      title: "Deleting product...",
      className: "bg-blue-50",
    });
    try {
      await deleteProduct({ id: id, type: type });
 
      toast.success("Successfully deleted");
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `Product : ${id} `,
      });
      const refreshProducts = fetchedProducts?.filter(
        (product) => product.id !== id
      );
      setFetchedProducts(refreshProducts);
    } catch (error) {
      if (error instanceof ApiError ) {
        toaster({
          icon: "error",
          title: error?.message,
          className: "bg-red-50",
        });
      }
    } 
    finally {
      setIsDelete(false);

      toast.dismiss(toastLoader);
 }
  };

  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedProduct?.filter(
      (product) => product.id !== id
    );

    isChecked
      ? setBulkSelectedProduct((prev) => {
          const newProduct = prev?.filter((product) => product.id !== id);
          const findProduct = fetchedProducts?.find(
            (product) => product.id === id
          );
          return newProduct
            ? [
                ...newProduct,
                { category: findProduct?.type, id: findProduct?.id },
              ]
            : [{ category: findProduct?.type, id: findProduct?.id }];
        })
      : setBulkSelectedProduct(refreshIds);
  };
  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const allProducts = fetchedProducts?.map((product) => {
        return { category: product.type, id: product.id };
      });
      setBulkSelectedProduct(
        allProducts as {
          category: "specials" | "products";
          id: string;
        }[]
      );
    }
    if (!isChecked) {
      setBulkSelectedProduct([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex flex-col justify-center gap-3 items-start w-full">
        <div className="flex w-full  sm:flex-row flex-col items-end sm:items-center justify-between ">
          <div className="flex w-full text-start py-2 flex-col -space-y-1.5 items-start justify-center gap-1">
            <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
              All Products
            </h4>
            <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
              {fetchedProducts?.length || 0} entries found
            </p>
          </div>
          <div className="flex items-center justify-start gap-3">
            <Button
              selectedCheck={[filter?.sortFilter?.id as string]}
              selectedTypes={[filter?.typeFilter?.id as string]}
              sortFn={(value) => setSortOrder(value)}
              bodyStyle={{
                width: "400px",
                top: "3rem",
                left: "-18rem",
              }}
              parent={
                <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-2">
                  <Icons.filter
                    strokeWidth={2.5}
                    className="size-5 text-[var(--dark-secondary-text)]"
                  />
                  <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                    Filter
                  </p>
                </div>
              }
              types={[
                { label: "Specials", value: "specials", id: "fklsdjf" },
                { label: "products", value: "products", id: "fkjdls" },
              ]}
              sort={[
                { label: "Price", value: "price", id: "jfhkdj" },
                { label: "Order", value: "order", id: "fkdsj" },
                { label: "Revenue", value: "revenue", id: "flkjdsf" },
              ]}
              checkFn={{
                checkTypeFn: (
                  isChecked: boolean,
                  value: "specials" | "products",
                  id
                ) => handleTypeCheck(isChecked, value, id),
                checkSortFn: (
                  isChecked: boolean,
                  value: "orders" | "revenue",
                  id
                ) => handleSortCheck(isChecked, value, id),
              }}
            />
            <div
              onClick={() => setIsUpload(!isUpload)}
              className="flex cursor-pointer bg-[var(--primary-color)] px-4 py-2 rounded items-center justify-start gap-2"
            >
              <Icons.upload strokeWidth={2.5} className="size-5 text-white" />
              <p className="text-[16px] text-white tracking-widest ">Upload</p>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col items-start sm:items-center justify-start sm:w-auto gap-2 w-full ">
          {" "}
          <div className="w-full flex items-center justify-start gap-2">
            <form
              action=""
              className="relative text-[var(--dark-text)] w-full "
            >
              <input
                id="search"
                type="search"
                onChange={(event) => debounceSearch(event?.target.value)}
                className=" border placeholder:tracking-wider placeholder:text-[16px] placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-border)] bg-[var(--light-background)] rounded-lg  ring-[var(--primary-color)] focus:ring-[3px] duration-150 "
                placeholder="Search for products"
              />
            </form>
            <div className="h-9  w-[1px] bg-gray-300  "></div>
            <DeleteButton
              dataLength={bulkSelectedProduct.length}
              deleteFn={() => setIsBulkDelete(true)}
            />
          </div>
          {filter?.sortFilter?.sort && (
            <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
              <div className="flex gap-1 items-center justify-center">
                <span className=" text-[15px] text-[var(--dark-secondary-text)]">
                  {filter.sortFilter.sort &&
                    filter.sortFilter.sort.toLowerCase()}
                </span>
              </div>
              <button
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    sortFilter: { id: undefined, sort: undefined },
                  }))
                }
                className=" "
              >
                <Icons.close className="text-[var(--danger-text)] " size={20} />
              </button>
            </div>
          )}
          {filter?.typeFilter?.type && (
            <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
              <div className="flex gap-1 items-center justify-center">
                <span className="    text-[15px] text-[var(--dark-secondary-text)]">
                  {filter.typeFilter.type &&
                    filter.typeFilter.type.toLowerCase()}
                </span>
              </div>
              <button
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    typeFilter: { id: undefined, type: undefined },
                  }))
                }
                className=" "
              >
                <Icons.close className="text-[var(--danger-text)] " size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <FoodTable
        totalData={fetchedProducts?.length as number}
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        onPageChange={(page: number) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        selectedData={bulkSelectedProduct?.map((product) => product.id)}
        actions={{
          checkFn: (id, isChecked) => handleBulkSelected(id, isChecked),
          delete: (id) => {
            const findProduct = fetchedProducts?.find(
              (product) => product.id === id
            );
            setId(id);
            setType(findProduct?.type);
            setIsDelete(true);
          },
          edit: (id: string) => {
            const findProduct = fetchedProducts?.find(
              (product) => product?.id === id
            );
            setModalData(findProduct);
            setIsEdit(false);
          },
          checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
        }}
        products={fetchedProducts}
        loading={specialLoading && normalLoading}
      />
      <Modal close={isEdit} closeModal={() => setIsEdit(true)}>
        <UpdateFood
          product={modalData as Ui.Product}
          closeModal={() => setIsEdit(true)}
        />
      </Modal>
      {isBulkDelete && (
        <Delete
          closeModal={() => setIsBulkDelete(false)}
          id={id as string}
          isClose={isBulkDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )}
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          type={type}
          isClose={isDelete}
          setDelete={(id: string, type: "specials" | "products") =>
            handleDelete(id, type)
          }
        />
      )}
      <Modal close={isUpload} closeModal={() => setIsUpload(!isUpload)}>
        <UploadFood closeModal={() => setIsUpload(!isUpload)} />
      </Modal>
    </div>
  );
};