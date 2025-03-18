
export const aggregateProducts = async (
  allProducts: Ui.Product[],
  revenues: Promise<Model.Revenue[]>
) => {
  // Calculate revenue and orders

  const revenueData = await revenues;

  const products: Ui.Product[] = allProducts.map((product: Ui.Product) => {
    let revenue: number = 0;
    let orders: number = 0;

    // Find matching product in revenue data
    revenueData.forEach((order: Model.Revenue) => {
      const matchingProduct = order.orders.find((p) => p.id === product.id);
      if (matchingProduct) {
        revenue +=
          Number(matchingProduct.price) * Number(matchingProduct.quantity);
        orders += Number(matchingProduct.quantity);
      }
    });

    // Return the updated product with calculated revenue, orders, and default rating
    return {
      ...product,
      revenue: revenue || 0,
      order: orders || 0,
      rating: 0, // Static rating for now, adjust if necessary
    };
  });

  const maxOrders = Math.max(
    ...products.map((product) => Number(product.order))
  );

  const ratedProducts = products?.map((product) => ({
    ...product,
    rating:
      product.order && Math.round((product.order / maxOrders) * 5) == 0
        ? 1
        : (product.order && Math.round((product.order / maxOrders) * 5)) || 0,
  }));
  return ratedProducts;
};
