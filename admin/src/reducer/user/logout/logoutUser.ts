export function logoutUser(state: Auth.authState) {
  state.userInfo = {};
  state.success = false;
  state.loading = false;
}
