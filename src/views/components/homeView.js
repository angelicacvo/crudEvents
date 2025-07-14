import privateNavbar from "./privateNavbar.js";
import { redirectIfNotLoggedIn } from "../../utils/routerGuard.js";
import { getEvents } from "../../services/js/getData.js";

export default function homeView() {
  // botón para salir de la sesión
  setTimeout(() => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        sessionStorage.clear();
        location.hash = "/login";
      });
    }
  }, 0);
  events();
  enrolledEvents();
  if (!redirectIfNotLoggedIn()) return "";
  return `
    ${privateNavbar()}
    
    <section class="container mt-4">
      <h1>Bienvenido a Crudevents</h1>
    </section>
    <section class="avaiable_events">
        <h2>Avaiable events</h2>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Capacity</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>  
                </tr>
            </thead>
            <tbody id="events-container">
            </tbody>
        </table>
    </section>
    <section class="enrolled_events">
        <h2>Your confirmed events</h2>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Date</th>
                </tr>
            </thead>
            <tbody id="confirmed-events">
            </tbody>
        </table>
    </section>
  `;
}

async function events() {
  const events = await getEvents();
  const eventsContainer = document.getElementById("events-container");
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const email = userData.email;

  eventsContainer.innerHTML = "";

  events.forEach((event) => {
    let registeredOrNot = "";
    if (event.assistants.includes(email)) {
      registeredOrNot = "Yes";
    } else if (!event.assistants.includes(email)) {
      registeredOrNot = "Not";
    }

    eventsContainer.innerHTML += `
            <tr>
            <td>${event.title}</td>
            <td>${event.description}</td>
            <td>${event.assistants.length}/${event.capacity}</td>
            <td>${event.date}</td>
            <td><button class="btn btn-danger mt-2" onclick="assistEvent('${event.id}', ${event.capacity})">Assist</button></td>
            </tr>
        `;
  });
}

async function assistEvent(id, capacity) {
  const events = await getEvents();
  const confirmAssistance = confirm("Are you sure you want to assist?");
  if (!confirmAssistance) {
    alert("Operation cancelled");
    return;
  }

  try {
    const resEvent = await fetch(`http://localhost:3000/events/${id}`);
    const event = await resEvent.json();
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const email = userData.email;
    const registeredAssistants = event.assistants || [];

    if (registeredAssistants.includes(email)) {
      alert("The user is already registered in this event");
      return;
    }
    if (registeredAssistants.length >= event.capacity) {
      alert("There's no more capacity for this event");
      return;
    }
    const updatedAssistants = [...registeredAssistants, email];

    const res = await fetch(`http://localhost:3000/events/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistants: updatedAssistants,
      }),
    });

    if (res.ok) {
      alert("Asisstance confirmed");
    } else {
      alert("Error confirming the assistance");
    }
  } catch (error) {
    console.error(error);
  }
}

window.assistEvent = assistEvent;

async function enrolledEvents() {
  const events = await getEvents();
  const confirmedEvents = document.getElementById("confirmed-events");
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const email = userData.email;

  confirmedEvents.innerHTML = "";

  events.forEach((event) => {
    if (event.assistants.includes(email)) {
      confirmedEvents.innerHTML += `
            <tr>
            <td>${event.title}</td>
            <td>${event.description}</td>
            <td>${event.date}</td>
            </tr>
        `;
    }
  });
}

