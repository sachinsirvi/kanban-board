// theme ele
const themeElem = document.getElementById("themeButton");
themeElem.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  themeElem.innerText = isDark ? "☼" : "☾";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeElem.innerText = "☼";
  }
});
