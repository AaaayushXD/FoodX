

export const calculateDiscountedPrice = (
  products: Ui.Product[],
  discountPercentage: number
) => {
  const dicountPercentageToEachProducts = products.length / discountPercentage;

  const productsWithDiscount = products?.map((product) => {
    const discountedPrice =
      product.price * (dicountPercentageToEachProducts / 100);
    return {
      ...product,
      price: product.price - discountedPrice,
    };
  });
  return productsWithDiscount;
};
