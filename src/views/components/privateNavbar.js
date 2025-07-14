export default function privateNavbar() {
  const user = JSON.parse(sessionStorage.getItem("user")) || { username: "Guest" };

  return `
    <nav class="navbar navbar-expand-lg px-3">
      <a class="navbar-brand" href="#/home"><i class="fa-solid fa-calendar"></i> Crudevents</a>
      <div class="d-flex align-items-center gap-3 ms-auto">
        <span class="navbar-text me-3">Welcome, ${user.username}</span>
        <button class="btn btn-outline-danger" id="logoutBtn">Logout</button>
      </div>
    </nav>
  `;
}

