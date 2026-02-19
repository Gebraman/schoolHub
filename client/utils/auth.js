export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isAdminOrStudent() {
  const user = getUser();
  return user && (user.role === "admin" || user.role === "student");
}
