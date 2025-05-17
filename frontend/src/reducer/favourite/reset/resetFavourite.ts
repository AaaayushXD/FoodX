export function deleteAll<T extends { favourite: string[] }>(state: T) {
  state.favourite = [];
}
