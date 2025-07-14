import adminNavbar from "./adminNavbar.js";
import { protectAdminRoute } from "../../utils/routerGuard.js";
import { getEvents } from "../../services/js/getData.js";

// Returns a login form which the user will fill with his data 
// to send his information to the database
// Set time out to wait until the DOM loads
// Includes router guard
export default function adminView() {
  setTimeout(() => {
    const logoutBtn = document.getElementById("logoutBtn");
    const addButton = document.getElementById("addButton")
    const updateButton = document.getElementById("updateButton")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        sessionStorage.clear();
        location.hash = "/login";
      });
    }
    if (addButton) {
      addButton.addEventListener("click", () => {
        addEvent();
      });
    }
    if (updateButton) {
      updateButton.addEventListener("click", () => {
        updateEvent();
      });
    }
  }, 0);
  events()
  if (!protectAdminRoute()) return "";
  return `
        ${adminNavbar()}
    
        <section>
          <table class="table">
            <thead>
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Capacity</th>
                <th scope="col">Confirmed</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>  
                </tr>
            </thead>
            <tbody id="events-container">
            </tbody>
          </table>
        </section>


        <button type="button" class="btn btn-primary addEventBtn btn-lg position-fixed end-0 bottom-0 m-5 " data-bs-toggle="modal" data-bs-target="#eventModal">
        Add event <i class="fa-solid fa-plus"></i>
        </button>

        <div
          class="modal fade"
          id="eventModal"
          tabindex="-1"
          aria-labelledby="eventModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg">
              <div class="modal-header">
                <h5 class="modal-title" id="eventModalLabel">Create event</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div class="modal-body">
                <form id="newEventForm">
                  <div class="mb-3">
                    <label for="eventTitle" class="form-label text-black"
                      >Title</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="eventTitle"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="capacity" class="form-label text-black"
                      >Event capacity</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="capacity"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="capacity" class="form-label text-black"
                      >Event date</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="date"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label
                      for="eventDescription"
                      class="form-label text-black"
                      >Description</label
                    >
                    <textarea
                      class="form-control"
                      id="eventDescription"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button
                      id="addButton"
                      type="button"
                      class="btn btn-primary"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="miModal2" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Update</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
              </div>
              <div class="modal-body">
                <input type="hidden" id="update-id">

                <div class="mb-3">
                  <label class="form-label">Title</label>
                  <input type="text" class="form-control" id="update-title">
                </div>
                <div class="mb-3">
                  <label class="form-label">Afforum</label>
                  <input type="number" class="form-control" id="update-afforum">
                </div>
                <div class="mb-3">
                  <label class="form-label">Date</label>
                  <input type="date" class="form-control" id="update-date">
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" id="update-description" rows="3"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button id="updateButton" class="btn btn-primary">Update</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
     `;
}

// method HTTP POST to add a new event 
async function addEvent() {
  const capacity = document.getElementById("capacity").value
  const eventTitle = document.getElementById("eventTitle").value;
  const eventDescription = document.getElementById("eventDescription").value
  const date = document.getElementById("date").value.toLocaleString("es-CO");
  const events = await getEvents()

  const exists = events.some(
    (event) => event.name === eventTitle
  )

  if (!eventTitle || !eventDescription || !date) {
    alert("Fill all fields")
  } else if (exists) {
    alert("This event is already in our database")
  } else {
    try {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDescription,
          date: date,
          capacity: capacity,
          assistants: []
        }),
      });
      alert("Event created successfully")
    } catch (error) {
      console.log(error)
    }
  }
}

// iterates in events db (object), returns each event 
// and injects each event inside events-container
async function events() {
  const events = await getEvents();
  const eventsContainer = document.getElementById("events-container")
  events.forEach(event => {
    eventsContainer.innerHTML +=
      `<tr>
            <td>${event.title}</td>
            <td>${event.description}</td>
            <td>${event.capacity}</td>
            <td>${event.assistants.length}/${event.capacity}</td>
            <td>${event.date}</td>
            <td><button class="btn btn-danger mt-2" onclick="deleteEvent('${event.id}')"><i class="fa-solid fa-trash"></i></button>
            <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#miModal2" onclick="loadEvent('${event.id}')"><i class="fa-solid fa-pen"></i></button></td>
        `
  });
}

// method HTTP DELETE to delete from events a determined event searched by id 
async function deleteEvent(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this event?"
  );
  if (!confirmDelete) {
    alert("Operation cancelled");
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/events/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Event deleted successfully");
    } else {
      alert("Error cancelling the event");
    }
  } catch (error) {
    console.error(error);
  }
}
window.deleteEvent = deleteEvent;

//load event searches the event by id 
async function loadEvent(id) {
  const res = await fetch(`http://localhost:3000/events/${id}`);
  const data = await res.json();

  document.getElementById("update-id").value = data.id;
  document.getElementById("update-title").value = data.title;
  document.getElementById("update-afforum").value = data.capacity;
  document.getElementById("update-description").value = data.description;
}

window.loadEvent = loadEvent;

// method HTTP PATCH to update the information of an event, could be one or multiple attributes
async function updateEvent() {
  const id = document.getElementById("update-id").value;
  const title = document.getElementById("update-title").value;
  const capacity = document.getElementById("update-afforum").value;
  const description = document.getElementById("update-description").value;

  const res = await fetch(`http://localhost:3000/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, capacity, description }),
  });

  if (res.ok) {
    alert("Event updated successfully");
  } else {
    alert("Error updating event");
  }
}
