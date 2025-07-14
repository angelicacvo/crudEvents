import { getUsers } from "../../services/js/getData.js";
import publicNavbar from "./publicNavbar.js"
import { redirectIfLoggedIn } from "../../utils/routerGuard.js";


// Returns a login form which the user will fill with his data 
// when he is already registered
// Set time out to wait until the DOM loads
// Includes router guard
export default function loginView() {
  setTimeout(() => {
    const loginButton = document.getElementById("loginButton")
    if (loginButton) {
      loginButton.addEventListener("click", async (e) => {
        e.preventDefault();
        login();
      })
    }

  }, 0);

  if (redirectIfLoggedIn()) return "";
  return `
    ${publicNavbar()}
    <section class="register_form">
        <form class="position-absolute top-50 start-50 translate-middle">
          <label for="email" class="form-label"
              >Email address</label
            >
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="name@example.com"
            />
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              class="form-control"
              aria-describedby="passwordHelpBlock"
            />
          </div>
            <button id="loginButton" type="button" class="btn btn-primary">Login</button>
          <a class="link" href="#/register" data-link
            >Don't you have an account? Register</a
          >
        </form>
      </section>`
}

// Verifies if the user data entered via input matches with the database data
// Uses session storage to set user data and auth as true so the user can login successfully
// redirects the user to the page according the role
async function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const users = await getUsers()
  const exists = users.find(
    (user) => user.email === email && user.password === password ||
      user.username === email && user.password === password
  )

  if (!email || !password) {
    alert("Fill all fields")
  } else if (exists) {
    alert(`Welcome, ${exists.fullName}`)
    const registeredUserData = {
      "email": exists.email,
      "username": exists.username,
      "fullName": exists.fullName,
      "role": exists.role
    }
    if (exists.role === "admin") {
      location.hash = "/admin";
    }
    else {
      location.hash = "/home";
    }
    sessionStorage.setItem("auth", "true")
    sessionStorage.setItem("user", JSON.stringify(registeredUserData))
  } else {
    alert("Wrong data. Please enter the right data")
  }
}



