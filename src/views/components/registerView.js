import publicNavbar from "./publicNavbar.js";
import { getUsers } from "../../services/js/getData.js"
import { redirectIfLoggedIn } from "../../utils/routerGuard.js";

// Returns a login form which the user will fill with his data 
// when he is already registered
// Set time out to wait until the DOM loads
// Includes router guard
export default function registerView() {
    setTimeout(() => {
        const registerButton = document.getElementById("registerButton")
        if (registerButton) {
            registerButton.addEventListener("click", async (e) => {
                e.preventDefault();
                registerUser();
            })
        }

    }, 0);
     if (redirectIfLoggedIn()) return "";
    return `
    ${publicNavbar()}
    <section class="register_form">
        <form class="position-absolute top-50 start-50 translate-middle">
          <label for="username" class="form-label"
            >Username</label
          >
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input
            id = "username"
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="mb-3">
            <label for="fullName" class="form-label"
              >First and last name</label
            >
            <div class="input-group">
              <span class="input-group-text">Full name</span>
              <input id="fullName" type="text" aria-label="Full name" class="form-control" />
            </div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label"
              >Email address</label
            >
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="name@example.com"
            />
          </div>
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
            <button id="registerButton" type="button" class="btn btn-primary">Register</button>
          <a href="#/login" data-link
            >Already have and account? Login</a
          >
        </form>
      </section>`
}

//register user makes an HTTP request POST to register the user after passing a few 
//verifications and sends to the database and to the session storage the user information
async function registerUser() {
    const username = document.getElementById("username").value.trim().toLowerCase();
    const fullName = document.getElementById("fullName").value.trim().toLowerCase();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value
    const users = await getUsers()
    const exists = users.find(
        (user) => user.email === email || user.username === username
    )

    if (!fullName || !username || !email || !password) {
        alert("Fill all fields")
    } else if (exists) {
        alert("User is already registered")
    } else {
        try {
            const res = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    username: username,
                    password: password,
                    role: "user"
                }),
            });
            const newUser = await res.json();
            const newUserData = {
                "email": newUser.email,
                "username": newUser.username,
                "fullName": newUser.fullName,
                "role": newUser.role
            }
            sessionStorage.setItem("auth", "true")
            sessionStorage.setItem("user", JSON.stringify(newUserData))
        } catch (error) {
            console.log(error);
        }
        alert(`Welcome, ${fullName}`)
        location.hash = "/home";
    }
}






