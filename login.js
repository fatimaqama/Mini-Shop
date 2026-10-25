document.addEventListener("DOMContentLoaded", () => {

  // Create default credentials if none exist
  if (!localStorage.getItem("username")) {
    localStorage.setItem("username", "admin");
  }

  if (!localStorage.getItem("password")) {
    localStorage.setItem("password", "1234");
  }

  const userInput = document.getElementById("username");
  const passInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const box = document.querySelector(".login-box");

  if (!userInput || !passInput || !loginBtn) {
    console.error("Login elements missing in HTML");
    return;
  }

  // Entrance animation
  setTimeout(() => {
    if (box) box.classList.add("show");
  }, 50);

  function shake() {
    if (!box) return;
    box.classList.add("shake");
    setTimeout(() => box.classList.remove("shake"), 400);
  }

  function login() {
    const user = userInput.value.trim();
    const pass = passInput.value.trim();

    if (!user || !pass) {
      shake();
      alert("Please fill all fields");
      return;
    }

    // Read stored credentials
    const savedUser = localStorage.getItem("username");
    const savedPass = localStorage.getItem("password");

    const isValid = (user === savedUser && pass === savedPass);

    if (isValid) {

      localStorage.setItem("auth", "true");
      localStorage.setItem("user", savedUser);

      if (box) box.classList.add("fade-out");

      setTimeout(() => {
        window.location.replace("index.html");
      }, 300);

    } else {
      shake();
      alert("Wrong credentials");
    }
  }

  loginBtn.addEventListener("click", login);

  passInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });

  document.body.classList.add("loaded");
});
