import { getUsers } from "../../services/js/getData.js";
import publicNavbar from "./publicNavbar.js"
import { redirectIfLoggedIn } from "../../utils/routerGuard.js";

export default function loginView() {
  // para que espere hasta que recargue el dom
  setTimeout(() => {
    const loginButton = document.getElementById("loginButton")
    if (loginButton) {
      loginButton.addEventListener("click", async (e) => {
        // para prevenir que se recargue la pagina
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
            <div id="passwordHelpBlock" class="form-text">
              Your password must be 8-20 characters long, contain letters and
              numbers, and must not contain spaces, special characters, or
              emoji.
            </div>
          </div>
            <button id="loginButton" type="button" class="btn btn-primary">Login</button>
          <a href="#/register" data-link
            >Don't you have an account? Register</a
          >
        </form>
      </section>`
}

async function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const users = await getUsers()
  // se hace una verificacion de que coincida lo que encuentra en la bd con username o email 
  // con lo que ingresas en el input del html
  const exists = users.find(
    (user) => user.email === email && user.password === password ||
      user.username === email && user.password === password
  )

  if (!email || !password) {
    alert("Fill all fields")
  } else if (exists) {
    alert(`Welcome, ${exists.fullName}`)
    // para que el objeto del session storage se lea
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
    // guardar en la sessionStorage la info de login de usuario
    // si es exitoso se pone en true el auth
    sessionStorage.setItem("auth", "true")
    // guardar en user un objeto con los datos que contiene exists ((user) => user.email === email || user.username === email)
    // se agrega el registeredUserData a la sessionStorage para que se lean los valores y pueda utilizarlos en el dom
    sessionStorage.setItem("user", JSON.stringify(registeredUserData))
  } else {
    alert("Wrong data. Please enter the right data")
  }
}



