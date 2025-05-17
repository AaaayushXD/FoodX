export function resetOrder<T extends { order: Model.Order[] }>(state: T) {
  state.order = [];
}
