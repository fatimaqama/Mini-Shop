console.log("CUSTOMERS JS LOADED");

// ===============================
// SHARED STORAGE (MATCH DASHBOARD)
// ===============================
let customersData = JSON.parse(localStorage.getItem("customersData") || "[]");
let editId = null;

// ===============================
// AUTH PROTECTION
// ===============================
if (localStorage.getItem("auth") !== "true") {
    window.location.replace("login.html");
}


// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderCustomers();
  updateStats();

  const openBtn = document.getElementById("openCustomerModal");
  const saveBtn = document.getElementById("saveCustomer");

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (saveBtn) saveBtn.addEventListener("click", saveCustomer);

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", closeModal);
  });

  window.editCustomer = editCustomer;
  window.deleteCustomer = deleteCustomer;
});

// ===============================
// ERROR HELPER (Glow + Toast)
// ===============================
function error(input, msg) {
  input.classList.add("error");
  showToast(msg);
  setTimeout(() => input.classList.remove("error"), 800);
}

// ===============================
// TOAST SYSTEM
// ===============================
function showToast(msg) {
  let box = document.getElementById("toast");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast";
    document.body.appendChild(box);
  }

  const t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  box.appendChild(t);

  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(40px)";
  }, 2500);

  setTimeout(() => t.remove(), 3000);
}

// ===============================
// PHONE VALIDATION + FORMAT
// ===============================
const phoneInput = document.getElementById("customerPhone");
if (phoneInput) {
  phoneInput.addEventListener("focus", () => {
    if (phoneInput.value.trim() === "") phoneInput.value = "+44 ";
  });

  phoneInput.addEventListener("input", () => {
    let raw = phoneInput.value;
    if (!raw.startsWith("+44 ")) raw = "+44 " + raw.replace(/[^\d]/g, "");
    let digits = raw.replace("+44 ", "").replace(/\D/g, "");
    if (digits.length > 5) {
      phoneInput.value = "+44 " + digits.slice(0, 5) + " " + digits.slice(5, 11);
    } else {
      phoneInput.value = "+44 " + digits;
    }
  });
}

// ===============================
// SAVE CUSTOMER (ADD + EDIT)
// ===============================
function saveCustomer() {
  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const ordersCount = parseInt(document.getElementById("customerOrders").value);
  const loyalty = document.getElementById("customerLoyalty").value;

  // ===============================
  // VALIDATION (PREMIUM LEVEL)
  // ===============================

  // NAME
  if (!name)
    return error(customerName, "Customer name required");

  // EMAIL
  if (!email || !email.includes("@"))
    return error(customerEmail, "Valid email required");

  // PHONE
  if (!phone.match(/^\+44\s\d{5}\s\d{6}$/))
    return error(customerPhone, "Phone must match +44 7xxxx xxxxx");

  // ADDRESS
  if (!address)
    return error(customerAddress, "Address required");

  if (address.length < 10)
    return error(customerAddress, "Address too short (min 10 characters)");

  if (address.length > 200)
    return error(customerAddress, "Address too long (max 200 characters)");

  // NUMBER OF ORDERS
  if (isNaN(ordersCount))
    return error(customerOrders, "Orders must be a number");

  if (ordersCount < 0)
    return error(customerOrders, "Orders cannot be negative");

  if (ordersCount === 0)
    return error(customerOrders, "Orders cannot be 0");

  // ===============================
  // DUPLICATE CHECK (PREMIUM)
  // ===============================
  const emailExists = customersData.some(
    c => c.email === email && c.id !== editId
  );

  if (emailExists)
    return error(customerEmail, "Email already registered");

  const phoneExists = customersData.some(
    c => c.phone === phone && c.id !== editId
  );

  if (phoneExists)
    return error(customerPhone, "Phone number already registered");

  // ===============================
  // STRUCTURED CUSTOMER OBJECT
  // ===============================
  const customerObj = {
    id: editId || Date.now(),
    name,
    email,
    phone,
    address,
    orders: ordersCount,
    loyalty,
    createdAt: new Date().toISOString()
  };

  // ===============================
  // ADD OR EDIT MODE
  // ===============================
  if (editId) {
    customersData = customersData.map(c =>
      c.id === editId ? customerObj : c
    );
    editId = null;
  } else {
    customersData.push(customerObj);
  }

  // ===============================
  // SAVE + REFRESH UI
  // ===============================
  saveCustomers();
  renderCustomers();
  updateStats();
  closeModal();
}


// ===============================
// RENDER TABLE
// ===============================
function renderCustomers() {
  const table = document.getElementById("customerTable");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Address</th>
      <th>Orders</th>
      <th>Loyalty</th>
      <th>Actions</th>
    </tr>
  `;

  customersData.forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>${c.address}</td>
        <td>${c.orders}</td>
        <td>${getStatusBadge(c.loyalty)}</td>
        <td>
  <button class="action-btn" onclick="editCustomer(${c.id})">
    <i class="fa-solid fa-pen-to-square"></i>
  </button>

  <button class="action-btn" onclick="deleteCustomer(${c.id})">
    <i class="fa-solid fa-trash-can"></i>
  </button>
</td>

      </tr>
    `;
  });
}

// ===============================
// STATUS BADGE
// ===============================
function getStatusBadge(status) {
  if (status === "VIP") {
    return '<span class="status-badge vip"><i class="fa-solid fa-crown"></i> VIP</span>';
  }

  if (status === "Inactive") {
    return '<span class="status-badge inactive"><i class="fa-solid fa-ban"></i> Inactive</span>';
  }

  return '<span class="status-badge active"><i class="fa-solid fa-circle-check"></i> Active</span>';
}

// ===============================
// DELETE CUSTOMER
// ===============================
function deleteCustomer(id) {
  customersData = customersData.filter(c => c.id !== id);
  saveCustomers();
  renderCustomers();
  updateStats();
}

// ===============================
// STATS
// ===============================
function updateStats() {
  const count = document.getElementById("customerCount");
  const loyaltyCount = document.getElementById("loyaltyCount");
  if (count) count.innerText = customersData.length;
  if (loyaltyCount)
    loyaltyCount.innerText = customersData.filter(c => c.loyalty === "Loyal").length;
}
// NEW CUSTOMERS THIS MONTH
const newMonthEl = document.getElementById("newCustomersCard");
if (newMonthEl) {
  let currentMonth = new Date().getMonth();
  let newThisMonth = customersData.filter(c => {
    let created = new Date(c.createdAt);
    return created.getMonth() === currentMonth;
  }).length;

  newMonthEl.innerText = newThisMonth;
}

// ===============================
// STORAGE
// ===============================
function saveCustomers() {
  localStorage.setItem("customersData", JSON.stringify(customersData));
}

// ===============================
// MODAL CONTROL
// ===============================
function openModal() {
  const modal = document.getElementById("customerModal");
  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("customerModal");
  modal.style.display = "none";
  modal.classList.remove("show");
  clearForm();
  editId = null;
}

// ===============================
// CLEAR FORM
// ===============================
function clearForm() {
  document.getElementById("customerName").value = "";
  document.getElementById("customerEmail").value = "";
  document.getElementById("customerPhone").value = "+44 ";
  document.getElementById("customerAddress").value = "";
  document.getElementById("customerOrders").value = 0;
  document.getElementById("customerLoyalty").value = "Active";
}

// ===============================
// EDIT CUSTOMER
// ===============================
function editCustomer(id) {
  const c = customersData.find(x => x.id === id);
  if (!c) return;

  document.getElementById("customerName").value = c.name;
  document.getElementById("customerEmail").value = c.email;
  document.getElementById("customerPhone").value = c.phone;
  document.getElementById("customerAddress").value = c.address;
  document.getElementById("customerOrders").value = c.orders;
  document.getElementById("customerLoyalty").value = c.loyalty;

  editId = id;
  openModal();
}

// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("auth");
  window.location.href = "login.html";
}
