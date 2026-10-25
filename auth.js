// GLOBAL LOGIN PROTECTION FOR ALL PAGES
if (localStorage.getItem("auth") !== "true") {
    window.location.replace("login.html");
}
