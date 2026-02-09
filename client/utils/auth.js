export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isAdminOrSuper() {
  const user = getUser();
  return user && (user.role === "admin" || user.role === "super_admin");
}
