export function logoutUser<T extends Auth.authState>(state: T) {
  state.loading = false;
  state.success = false;
  state.userInfo = {};
  state.error = null;
}
