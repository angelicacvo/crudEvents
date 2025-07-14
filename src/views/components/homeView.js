import privateNavbar from "./privateNavbar.js";
import { redirectIfNotLoggedIn } from "../../utils/routerGuard.js";
import { getCourses } from "../../services/js/getData.js";

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
  courses();
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
            <tbody id="courses-container">
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

async function courses() {
  const courses = await getCourses();
  const coursesContainer = document.getElementById("courses-container");
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const email = userData.email;

  coursesContainer.innerHTML = "";

  courses.forEach((course) => {
    let registeredOrNot = "";
    if (course.assistants.includes(email)) {
      registeredOrNot = "Yes";
    } else if (!course.assistants.includes(email)) {
      registeredOrNot = "Not";
    }

    coursesContainer.innerHTML += `
            <tr>
            <td>${course.title}</td>
            <td>${course.description}</td>
            <td>${course.assistants.length}/${course.capacity}</td>
            <td>${course.date}</td>
            <td><button class="btn btn-danger mt-2" onclick="assistCourse('${course.id}', ${course.capacity})">Assist</button></td>
            </tr>
        `;
  });
}

async function assistCourse(id, capacity) {
  const courses = await getCourses();
  const confirmAssistance = confirm("Are you sure you want to assist?");
  if (!confirmAssistance) {
    alert("Operation cancelled");
    return;
  }

  try {
    const resCourse = await fetch(`http://localhost:3000/courses/${id}`);
    const course = await resCourse.json();
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const email = userData.email;
    const registeredAssistants = course.assistants || [];

    if (registeredAssistants.includes(email)) {
      alert("The user is already registered in this event");
      return;
    }
    if (registeredAssistants.length >= course.capacity) {
      alert("There's no more capacity for this course");
      return;
    }
    const updatedAssistants = [...registeredAssistants, email];

    const res = await fetch(`http://localhost:3000/courses/${id}`, {
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

window.assistCourse = assistCourse;

async function enrolledEvents() {
  const courses = await getCourses();
  const confirmedEvents = document.getElementById("confirmed-events");
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const email = userData.email;

  confirmedEvents.innerHTML = "";

  courses.forEach((course) => {
    if (course.assistants.includes(email)) {
      confirmedEvents.innerHTML += `
            <tr>
            <td>${course.title}</td>
            <td>${course.description}</td>
            <td>${course.date}</td>
            </tr>
        `;
    }
  });
}

