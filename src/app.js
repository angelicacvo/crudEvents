import {router} from "./utils/router.js"
// to import the routes and loads into the DOM
window.addEventListener("DOMContentLoaded", router)
window.addEventListener("hashchange", router)