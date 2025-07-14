// hace parte del spa es para importar las rutas y que se carguen en DOM y que se escuchen el hash change
import {router} from "./utils/router.js"
// para que escuche las rutas
window.addEventListener("DOMContentLoaded", router)
// hashachange es para cambiar las rutas cuando se haga click y se actualice en la url
window.addEventListener("hashchange", router)