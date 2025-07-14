// guardian de la ruta, verifica que esté autenticado en true
// nueva

// Verifica si hay una sesión autenticada activa
export function isAuthenticated() {
    return sessionStorage.getItem("auth") === "true";
}

// Redirige al login si no está autenticado
export function redirectIfNotLoggedIn() {
    const isAuth = isAuthenticated();

    if (!isAuth) {
        location.hash = "/login";
        return false;
    }

    return true;
}

// Obtiene los datos del usuario desde sessionStorage
export function getUser() {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

// Protege rutas solo para administradores
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

// 🔒 Evita que un usuario autenticado entre a login o register
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
