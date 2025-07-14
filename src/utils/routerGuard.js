// verifies if the user verification is true
export function isAuthenticated() {
    return sessionStorage.getItem("auth") === "true";
}

// redirects to login if the user is not autenticated
export function redirectIfNotLoggedIn() {
    const isAuth = isAuthenticated();

    if (!isAuth) {
        location.hash = "/login";
        return false;
    }

    return true;
}

export function getUser() {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

// route protection only for admins
export function protectAdminRoute() {
    const auth = isAuthenticated();
    const user = getUser();

    if (!auth || !user) {
        location.hash = "/login";
        return false;
    }

    if (user.role !== "admin") {
        alert("Only admin can access here.");
        location.hash = "/home";
        return false;
    }

    return true;
}

// route protection to login and register if the user is autenticated already
export function redirectIfLoggedIn() {
    const isAuth = isAuthenticated();
    const user = getUser();

    if (isAuth && user) {
        if (user.role === "admin") {
            location.hash = "/admin";
        } else {
            location.hash = "/home";
        }
        return true;
    }

    return false;
}
