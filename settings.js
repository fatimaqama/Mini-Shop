// LOGIN PROTECTION
if (localStorage.getItem("auth") !== "true") {
    window.location.replace("login.html");
}

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       MODAL SYSTEM
    =============================== */

    function openModal(modal) {
        if (!modal) return;
        modal.style.display = "flex";
        modal.classList.add("show");
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.style.display = "none";
        modal.classList.remove("show");
    }

    /* ===============================
       EDIT PROFILE MODAL
    =============================== */

    const profileBtn = document.querySelector(".btn-edit");
    const editProfileModal = document.getElementById("editProfileModal");
    const editProfileForm = document.getElementById("editProfileForm");
    const profilePhone = document.getElementById("profilePhone");

    if (profileBtn && editProfileModal) {
        profileBtn.addEventListener("click", () => openModal(editProfileModal));
    }

    /* ===============================
       PHONE AUTO-FORMAT + LIMIT
    =============================== */

    profilePhone.addEventListener("input", () => {
        let digits = profilePhone.value.replace(/[^0-9]/g, "");

        if (digits.startsWith("44")) digits = digits.slice(2);
        if (digits.length > 11) digits = digits.slice(0, 11);

        const formatted = digits.replace(/^(\d{5})(\d+)/, "$1 $2");
        profilePhone.value = "+44 " + formatted;
    });

    /* ===============================
       FORM SUBMIT VALIDATION + SAVE
    =============================== */

    if (editProfileForm) {
        editProfileForm.addEventListener("submit", e => {
            e.preventDefault();

            const name = document.getElementById("profileName").value.trim();
            const email = document.getElementById("profileEmail").value.trim();
            const phone = profilePhone.value.trim();
            const address = document.getElementById("profileAddress").value.trim();

            if (!name) return showToast("Name is required");
            if (!email.includes("@")) return showToast("Valid email required");

            const phonePattern = /^\+44\s\d{5}\s\d{6}$/;
            if (!phonePattern.test(phone))
                return showToast("Phone must match +44 7xxxx xxxxx");

            if (address.length < 10)
                return showToast("Address too short (min 10 characters)");
            if (address.length > 200)
                return showToast("Address too long (max 200 characters)");

            // ⭐ SAVE UPDATED PROFILE INFO
            localStorage.setItem("username", name);
            localStorage.setItem("email", email);
            localStorage.setItem("phone", phone);
            localStorage.setItem("address", address);

            showToast("Profile updated ✔");
            closeModal(editProfileModal);
        });
    }

    /* ===============================
       SECURITY MODAL
    =============================== */

    const secureBtn = document.querySelector(".btn-secure");
    const securityModal = document.getElementById("securityModal");

    document.getElementById("securityForm").addEventListener("submit", e => {
        e.preventDefault();

        const current = document.getElementById("currentPassword").value.trim();
        const newPass = document.getElementById("newPassword").value.trim();
        const confirm = document.getElementById("confirmPassword").value.trim();

        const savedPass = localStorage.getItem("password");

        if (!current || !newPass || !confirm)
            return showToast("All fields are required");

        if (current !== savedPass)
            return showToast("Current password is incorrect");

        if (newPass.length < 8)
            return showToast("Password must be at least 8 characters");

        if (newPass !== confirm)
            return showToast("Passwords do not match");

        // ⭐ SAVE NEW PASSWORD
        localStorage.setItem("password", newPass);

        showToast("Security settings updated ✔");
        closeModal(securityModal);
    });

    if (secureBtn && securityModal) {
        secureBtn.addEventListener("click", () => openModal(securityModal));
    }

    /* ===============================
       CLOSE MODALS
    =============================== */

    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            closeModal(modal);
        });
    });

    window.addEventListener("click", e => {
        if (e.target.classList.contains("modal")) {
            closeModal(e.target);
        }
    });

    /* ===============================
       TOAST SYSTEM
    =============================== */

    function showToast(message) {
        const toastContainer = document.getElementById("toast");
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "toast-message";
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(-10px)";
        }, 2500);

        setTimeout(() => toast.remove(), 3200);
    }

    /* ===============================
       NOTIFICATION SWITCH
    =============================== */

    const notifSwitch = document.querySelector(".switch input");

    if (notifSwitch) {
        notifSwitch.addEventListener("change", () => {
            showToast(
                notifSwitch.checked
                    ? "Notifications enabled"
                    : "Notifications disabled"
            );
        });
    }
        /* ===============================
       Password hide/show
    =============================== */
    document.querySelectorAll(".password-wrapper i").forEach(icon => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});


});
