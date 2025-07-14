// router to each view, this is essential for SPA
const routes = {
    "/": async () => await import("../views/components/loginView.js"),
    "/register": async () => await import("../views/components/registerView.js"),
    "/login": async () => await import("../views/components/loginView.js"),
    "/home": async () => await import("../views/components/homeView.js"),
    "/admin": async () => await import("../views/components/adminView.js"),
}

// Uses function hash for the url we want to get
// Inject in index.html with innerHTML without reload te page
export async function router() {
    const hash = location.hash.slice(1).toLowerCase() || "/";
    const viewFunc = routes[hash] || routes["/"];
    const view = await viewFunc();
    document.getElementById("content").innerHTML = view.default()
}