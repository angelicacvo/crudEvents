const routes = {
    "/": async () => await import("../views/components/loginView.js"),
    "/register": async () => await import("../views/components/registerView.js"),
    "/login": async () => await import("../views/components/loginView.js"),
    "/home": async () => await import("../views/components/homeView.js"),
    "/admin": async () => await import("../views/components/adminView.js"),
}

export async function router() {
    // funcion hash para routear la url hacia donde quiero llegar
    // slice para quitar el numeral pero siga con la funcion de hash que es para enrutar
    const hash = location.hash.slice(1).toLowerCase() || "/";
    const viewFunc = routes[hash] || routes["/"];
    const view = await viewFunc();
    // se inyecta la vista html sin recargar la pagina en el content ej <main id="content"></main>
    document.getElementById("content").innerHTML = view.default()
}