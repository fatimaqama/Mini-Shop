let favicon;

function updateFavicon(isDark) {
   if (!favicon) return;

   favicon.href = isDark
      ? "assets/logos/icons/favicon-dark.svg"
      : "assets/logos/icons/favicon.svg";
}
document.addEventListener("DOMContentLoaded", () => {
    
    favicon = document.getElementById("favicon");
    const darkToggle = document.getElementById("darkToggle");
    const logo = document.getElementById("mainLogo");

    function updateTheme(){

    const dark = localStorage.getItem("theme") === "dark";

    document.body.classList.toggle("dark", dark);

    updateFavicon(dark); // 👈 ADD THIS LINE

    if(logo){

        logo.src = dark
            ? "assets/logos/logo-dark.svg"
            : "assets/logos/logo-light.svg";

    }
    
}

    updateTheme();

    if(darkToggle){

        darkToggle.addEventListener("click",()=>{
            

            const dark =
                !document.body.classList.contains("dark");

            localStorage.setItem(
                "theme",
                dark ? "dark" : "light"
            );

            updateTheme();

        });
        

    }
    document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});


});