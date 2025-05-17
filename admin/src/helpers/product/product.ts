
export const totalQuantity = (products: Ui.Product[]) => {
  const customerOrderQuantity = products?.reduce(
    (prodSum, product) => prodSum + Number(product.quantity),
    0
  );
  return customerOrderQuantity;
};
// total Revenue
export const totalRevenue = (orders: Ui.Order[]) => {
  const revenue = orders?.reduce(
    (total, order) =>
      total +
      order?.products.reduce(
        (totalProd, product) => totalProd + Number(product.price),
        0
      ),

    0
  );
  return revenue;
};

export const totalCost = (products: Ui.Product[]) => {
  const customerOrderCost = products.reduce(
    (prodSum, product) => prodSum + Number(product.price),
    0
  );
  typeof customerOrderCost;
  return customerOrderCost;
};

export const SearchProduct = (customers: Ui.Product[], value: string) => {
  const searchingProduct = customers?.filter((order) => {
    return order.name.toLowerCase().includes(value);
  });
  return searchingProduct;
};
