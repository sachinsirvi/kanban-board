// ---- DOM elements ----
const addTaskButton = document.getElementById("addTaskButton");
const ticketModel = document.querySelector(".ticket-model");
const newDescElem = document.querySelector(".ticket-add-text");
const ticketContainer = document.querySelector(".ticket-task-container");
const colorContainer = document.querySelector(".ticket-colors");
const statusBox = document.querySelector(".status-box");
const statusDropdown = document.querySelector('.status-dropdown');
const themeElem = document.getElementById("themeButton");

let ticketColor = "unconfirmed";
let lock = true;
const COLORS = ["unconfirmed", "confirmed", "indev", "closed"];

// ---- Event Handlers ----

// Show add ticket modal
addTaskButton.addEventListener("click", () => {
  ticketModel.classList.toggle("hidden");
});

// Ticket color select in modal
colorContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("ticket")) {
    ticketColor = e.target.classList[1];
    document.querySelectorAll(".ticket").forEach((btn) => btn.classList.remove("selected-color"));
    e.target.classList.add("selected-color");
  }
});

// Save new ticket
newDescElem.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const content = e.target.value.trim();
    if (content) newTicket(ticketColor, content);
  }
});

// Delete ticket
ticketContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("ticket-task-delete")) {
    const ticketElem = e.target.closest(".ticket-task");
    const ticketId = ticketElem.getAttribute("data-id");
    ticketElem.remove();
    const existingTickets = JSON.parse(localStorage.getItem("tickets"));
    const updatedTickets = existingTickets.filter((ticket) => ticket.id !== parseInt(ticketId));
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
  }
});

// Filter tickets (desktop)
statusBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("status")) {
    const filterColor = e.target.classList.contains("status-unconfirmed")
      ? "unconfirmed"
      : e.target.classList.contains("status-confirmed")
      ? "confirmed"
      : e.target.classList.contains("status-indev")
      ? "indev"
      : e.target.classList.contains("status-closed")
      ? "closed"
      : null;
    document.querySelectorAll(".ticket-task").forEach((ticket) => {
      ticket.style.display = !filterColor || ticket.getAttribute("data-color") === filterColor ? "" : "none";
    });
  }
});

// Filter tickets (mobile)
if (statusDropdown) {
  statusDropdown.addEventListener('change', (e) => {
    const filterColor = e.target.value;
    document.querySelectorAll('.ticket-task').forEach(ticket => {
      ticket.style.display = !filterColor || ticket.getAttribute('data-color') === filterColor ? '' : 'none';
    });
  });
}

// Edit ticket (lock/unlock & change color)
ticketContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("ticket-task-lock")) {
    const ticketElem = e.target.closest(".ticket-task");
    const descElem = ticketElem.querySelector(".ticket-task-description");
    const lockElem = ticketElem.querySelector(".ticket-task-lock");
    const colorElem = ticketElem.querySelector(".ticket-task-color");
    lock = !lock;
    if (!lock) {
      lockElem.innerText = "🔓";
      descElem.contentEditable = true;
      colorElem.onclick = function () {
        const currentIndex = COLORS.findIndex((color) => colorElem.classList.contains(color));
        colorElem.classList.remove(COLORS[currentIndex]);
        const newIndex = (currentIndex + 1) % COLORS.length;
        colorElem.classList.add(COLORS[newIndex]);
        ticketElem.setAttribute("data-color", COLORS[newIndex]);
      };
      colorElem.style.cursor = "pointer";
    } else {
      lockElem.innerText = "🔒";
      descElem.contentEditable = false;
      colorElem.onclick = null;
      colorElem.style.cursor = "default";
    }
  }
});

// Theme toggle
themeElem.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  themeElem.innerText = isDark ? "☼" : "☾";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ---- Utilities ----

// Add new ticket to DOM & localStorage
function newTicket(color, content) {
  const ticketId = Date.now();
  const ticketObj = { id: ticketId, color, content, lock: "🔒" };
  let existingTickets = JSON.parse(localStorage.getItem("tickets")) || [];
  existingTickets.push(ticketObj);
  renderTicket(ticketObj);
  localStorage.setItem("tickets", JSON.stringify(existingTickets));
  document.querySelector(".ticket-add-text").value = "";
  ticketModel.classList.toggle("hidden");
}

// Render single ticket to DOM
function renderTicket(ticketObj) {
  const newDivElem = document.createElement("div");
  newDivElem.classList.add("ticket-task");
  newDivElem.setAttribute("data-id", ticketObj.id);
  newDivElem.setAttribute("data-color", ticketObj.color);
  newDivElem.innerHTML = `
    <div class="ticket-task-delete">⤫</div>
    <div class="ticket-task-id">Id : ${ticketObj.id}</div>
    <div class="ticket-task-color ${ticketObj.color}"></div>
    <div class="ticket-task-description" contenteditable="false">${ticketObj.content}</div>
    <div class="ticket-task-lock" data-locked="true">${ticketObj.lock}</div>
  `;
  document.querySelector(".ticket-task-container").appendChild(newDivElem);
}

// ---- Initialization ----
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeElem.innerText = "☼";
  }
  const existingTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  existingTickets.forEach(renderTicket);
});
