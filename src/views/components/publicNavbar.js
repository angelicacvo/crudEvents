export default function publicNavbar() {
  return `
    <nav class="navbar navbar-expand-lg px-3">
      <a class="navbar-brand" href="#/login"><i class="fa-solid fa-calendar"></i> Crudevents</a>
      <div class="ms-auto d-flex gap-2">
        <a href="#/login" class="btn btn-outline-primary">Login</a>
        <a href="#/register" class="btn btn-outline-secondary">Register</a>
      </div>
    </nav>
  `;
}
