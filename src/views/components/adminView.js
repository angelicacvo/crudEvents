import adminNavbar from "./adminNavbar.js";
import { protectAdminRoute } from "../../utils/routerGuard.js";
import { getCourses } from "../../services/js/getData.js";

export default function adminView() {
  // botón para salir de la sesión
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
        addCourse();
      });
    }
    if (updateButton) {
      updateButton.addEventListener("click", () => {
        updateCourse();
      });
    }
  }, 0);
  courses()
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
            <tbody id="courses-container">
            </tbody>
          </table>
        </section>


        <button type="button" class="btn btn-primary btn-lg position-fixed end-0 bottom-0 m-5 " data-bs-toggle="modal" data-bs-target="#courseModal">
        Add course
        </button>

        <div
          class="modal fade"
          id="courseModal"
          tabindex="-1"
          aria-labelledby="courseModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg">
              <div class="modal-header">
                <h5 class="modal-title" id="courseModalLabel">Create course</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div class="modal-body">
                <form id="newCourseForm">
                  <div class="mb-3">
                    <label for="courseTitle" class="form-label text-black"
                      >Title</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="courseTitle"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="capacity" class="form-label text-black"
                      >Course capacity</label
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
                      >Course date</label
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
                      for="courseDescription"
                      class="form-label text-black"
                      >Description</label
                    >
                    <textarea
                      class="form-control"
                      id="courseDescription"
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
                <button id="updateButton" class="btn btn-primary">Actualizar</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
     `;
}

async function addCourse() {
  const capacity = document.getElementById("capacity").value
  const courseTitle = document.getElementById("courseTitle").value;
  const courseDescription = document.getElementById("courseDescription").value
  const date = document.getElementById("date").value.toLocaleString("es-CO");
  const courses = await getCourses()

  const exists = courses.some(
    (course) => course.name === courseTitle
  )

  if (!courseTitle || !courseDescription || !date) {
    alert("Fill all fields")
  } else if (exists) {
    alert("This course is already in our database")
  } else {
    try {
      const res = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDescription,
          date: date,
          capacity: capacity,
          assistants: []
        }),
      });
      alert("Course created successfully")
    } catch (error) {
      console.log(error)
    }
  }
}

async function courses() {
  const courses = await getCourses();
  const coursesContainer = document.getElementById("courses-container")
  courses.forEach(course => {
    coursesContainer.innerHTML +=
      `<tr>
            <td>${course.title}</td>
            <td>${course.description}</td>
            <td>${course.capacity}</td>
            <td>${course.assistants.length}/${course.capacity}</td>
            <td>${course.date}</td>
            <td><button class="btn btn-danger mt-2" onclick="deleteCourse('${course.id}')">Delete</button>
            <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#miModal2" onclick="loadCourse('${course.id}')">Update</button></td>
        `
  });
}

async function deleteCourse(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this course?"
  );
  if (!confirmDelete) {
    alert("Operation cancelled");
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/courses/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Course deleted successfully");
    } else {
      alert("Error cancelling the course");
    }
  } catch (error) {
    console.error(error);
  }
}
window.deleteCourse = deleteCourse;

async function loadCourse(id) {
  const res = await fetch(`http://localhost:3000/courses/${id}`);
  const data = await res.json();

  document.getElementById("update-id").value = data.id;
  document.getElementById("update-title").value = data.title;
  document.getElementById("update-afforum").value = data.capacity;
  document.getElementById("update-description").value = data.description;
}

window.loadCourse = loadCourse;

async function updateCourse() {
  const id = document.getElementById("update-id").value;
  const title = document.getElementById("update-title").value;
  const capacity = document.getElementById("update-afforum").value;
  const description = document.getElementById("update-description").value;

  const res = await fetch(`http://localhost:3000/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, capacity, description }),
  });

  if (res.ok) {
    alert("Course updated successfully");
  } else {
    alert("Error updating course");
  }
}
