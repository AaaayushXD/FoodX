import { Request, Response } from "express";
import { redisClient } from "../../utils/cache/cache.js";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { getPopularProductsFromDatabase } from "../../actions/products/get/getPopularProducts.js";
import { searchProductInDatabase } from "../../actions/products/get/searchProducts.js";
import { getAllProductsFromDatabase } from "../../actions/products/get/getAllProducts.js";
import { getProductByTagFromDatabase } from "../../actions/products/get/getProductByTag.js";
import { addProductToFirestore } from "../../actions/products/add/addProduct.js";
import { updateProductInDatabase } from "../../actions/products/update/updateProduct.js";
import { bulkDeleteProductsFromDatabase } from "../../actions/products/delete/bulkDeleteProduct.js";
import { deleteProductFromDatabase } from "../../actions/products/delete/deleteProduct.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { addProductSchemaType } from "../../utils/validate/product/add/addProductSchema.js";
import { updateProductSchemaType } from "../../utils/validate/product/update/updateProductSchema.js";
import { getProductById } from "../../actions/products/get/getProductById.js";

const getPopularProducts = asyncHandler(async (_: Request, res: Response) => {
  const products = await getPopularProductsFromDatabase();
  await redisClient.set("popular_products", JSON.stringify(products), {
    EX: 3600,
  });
  const response: API.ApiResponse = {
    status: 200,
    data: products,
    message: "Popular products fetched successfully.",
    success: true,
  };
  return res.status(200).json(response);
});

const searchProduct = asyncHandler(
  async (req: Request<{}, {}, {}, { search: string }>, res: Response) => {
    const search = req.query.search;
    if (!search) throw new APIError("No search query provided.", 400);

    const products = await searchProductInDatabase(search);

    const response: API.ApiResponse = {
      status: 200,
      data: products,
      message: "Product fetched successfully.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const getAllProducts = asyncHandler(async (_: Request, res: Response) => {
  const products = await getAllProductsFromDatabase("products");
  await redisClient.set("products", JSON.stringify(products), {
    EX: 3600,
  });

  const response: API.ApiResponse = {
    status: 200,
    data: products,
    message: "All products fetched successfully.",
    success: true,
  };
  return res.status(200).json(response);
});

const getSpecialProducts = asyncHandler(async (_: Request, res: Response) => {
  let response: API.ApiResponse;
  const products = await getAllProductsFromDatabase("specials");
  await redisClient.set("specials", JSON.stringify(products), {
    EX: 3600,
  });

  response = {
    status: 200,
    data: products,
    message: "All today's specials fetched successfully.",
    success: true,
  };
  return res.status(200).json(response);
});

const getProductByTag = asyncHandler(
  async (req: Request<{ tag: string }>, res: Response) => {
    const tag = req.params.tag;
    if (!tag) throw new APIError("No tag was provided.", 400);
    const products = await getProductByTagFromDatabase(tag, "products");
    await redisClient.set(`product:${tag}`, JSON.stringify(products), {
      EX: 3600,
    });

    const response: API.ApiResponse = {
      status: 200,
      data: products ?? [],
      message: "Product based on tags are fetched successfully.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const addProduct = asyncHandler(
  async (
    req: Request<
      { collection: Product.Collection["name"] },
      {},
      addProductSchemaType
    >,
    res: Response
  ) => {
    const product = req.body;
    const collection = req.params.collection;

    if (
      !collection ||
      (collection !== "products" && collection !== "specials")
    ) {
      throw new APIError("Invalid collection.", 400);
    }

    let apiResponse: API.ApiResponse;

    await addProductToFirestore(
      {
        id: "",
        ...product,
        totalSold: 0,
      },
      collection
    );
    await redisClient.del(collection);

    const updatedProductData = await getAllProductsFromDatabase(collection);

    await redisClient.set(collection, JSON.stringify(updatedProductData), {
      EX: 3600,
    });

    apiResponse = {
      status: 201,
      data: updatedProductData,
      message: "Added Product successfully.",
      success: true,
    };
    return res.status(201).json(apiResponse);
  }
);

const updateProduct = asyncHandler(
  async (
    req: Request<
      { collection: Product.Collection["name"] },
      {},
      updateProductSchemaType
    >,
    res: Response
  ) => {
    const { id, field, newData } = req.body;
    const collection = req.params.collection;

    if (
      !collection ||
      (collection !== "products" && collection !== "specials")
    ) {
      throw new APIError("Invalid collection.", 400);
    }

    let response: API.ApiResponse;
    const updatedProduct = await updateProductInDatabase(
      collection,
      field as keyof Product.ProductData,
      id,
      newData
    );

    await redisClient.del(collection);
    const updatedProductData = await getAllProductsFromDatabase(collection);
    await redisClient.set(collection, JSON.stringify(updatedProductData), {
      EX: 3600,
    });

    response = {
      status: 200,
      data: updatedProduct,
      message: "Product updated successfully.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const deleteProductsInBulk = asyncHandler(
  async (
    req: Request<
      { collection: Product.Collection["name"] },
      {},
      { ids: string[] }
    >,
    res: Response
  ) => {
    const { ids } = req.body;
    if (!ids || ids.length < 1) throw new APIError("No ids provided.", 400);

    const collection = req.params.collection;
    if (
      !collection ||
      (collection !== "products" && collection !== "specials")
    ) {
      throw new APIError("Invalid collection.", 400);
    }

    await bulkDeleteProductsFromDatabase(collection, ids);
    await redisClient.del(collection);
    const updatedProductData = await getAllProductsFromDatabase(collection);

    await redisClient.set(collection, JSON.stringify(updatedProductData), {
      EX: 3600,
    });

    const response: API.ApiResponse = {
      status: 200,
      data: updatedProductData,
      message: "Products deleted in bulk successfully.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const deleteProduct = asyncHandler(
  async (
    req: Request<
      { id: string },
      {},
      { collection: Product.Collection["name"] }
    >,
    res: Response
  ) => {
    const { id } = req.params;
    if (!id) throw new APIError("No id provided.", 400);

    const collection = req.query.collection;
    if (
      !collection ||
      (collection !== "products" && collection !== "specials")
    ) {
      throw new APIError("Invalid collection.", 400);
    }

    let response: API.ApiResponse;

    await deleteProductFromDatabase(id, collection);
    await redisClient.del(collection);
    const updatedProductData = await getAllProductsFromDatabase(collection);

    await redisClient.set(collection, JSON.stringify(updatedProductData), {
      EX: 3600,
    });

    response = {
      status: 200,
      data: updatedProductData,
      message: "Product deleted successfully.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const productContGetProductById = asyncHandler(
  async (
    req: Request<
      { id: string },
      null,
      null,
      {
        collection: "products" | "specials";
      }
    >,
    res: Response
  ) => {
    const id = req.params.id;
    const collection = req.query.collection;
    if (!id || !collection)
      throw new APIError("No id or collection provided.", 400);

    const product = await getProductById(id, collection);
    const response: API.ApiResponse = {
      status: 200,
      data: product,
      message: "Product fetched successfully.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

export {
  getAllProducts,
  getSpecialProducts,
  addProduct,
  updateProduct,
  getProductByTag,
  deleteProductsInBulk,
  deleteProduct,
  getPopularProducts,
  searchProduct,
  productContGetProductById,
};
