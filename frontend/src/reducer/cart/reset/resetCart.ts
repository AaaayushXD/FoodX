export function deleteAll<T extends { products: Ui.Product[] }>(state: T) {
  state.products = [];
}
