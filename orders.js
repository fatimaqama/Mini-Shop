// ===============================
// LOGIN PROTECTION
// ===============================
function logout() {
  localStorage.removeItem("auth");
  window.location.replace("login.html");
}
// ===============================
// PRODUCTS (auto SKU + price)
// ===============================
const products = [
  { sku: "APL001", name: "Apples", price: 1.20 },
  { sku: "MLK002", name: "Milk", price: 0.99 },
  { sku: "BTR003", name: "Butter", price: 2.49 },
  { sku: "BRD004", name: "Bread", price: 1.10 },
  { sku: "EGG005", name: "Eggs (12 pack)", price: 2.99 },
  { sku: "CHS006", name: "Cheese", price: 3.49 },
  { sku: "CKN007", name: "Chicken Breast", price: 5.99 },
  { sku: "RCE008", name: "Rice (1kg)", price: 1.89 },
  { sku: "PST009", name: "Pasta", price: 1.29 },
  { sku: "BNN010", name: "Bananas", price: 0.79 }
];

// ===============================
// STATE
// ===============================
let orders = JSON.parse(localStorage.getItem("orders") || "[]");
let editOrderId = null;
let currentItems = [];

// ===============================
// HELPERS
// ===============================
function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function formatMoney(v) {
  return "£" + v.toFixed(2);
}

function calcTotals() {
  const subtotal = currentItems.reduce((sum, item) => sum + item.total, 0);

  const taxRate = parseFloat(document.getElementById("orderTaxRate").value || 0) / 100;
  const discountRate = parseFloat(document.getElementById("orderDiscountRate").value || 0) / 100;

  const taxAmount = subtotal * taxRate;
  const discountAmount = subtotal * discountRate;
  const total = subtotal + taxAmount - discountAmount;

  document.getElementById("summarySubtotal").textContent = formatMoney(subtotal);
  document.getElementById("summaryTax").textContent = formatMoney(taxAmount);
  document.getElementById("summaryDiscount").textContent = formatMoney(discountAmount);
  document.getElementById("summaryTotal").textContent = formatMoney(total);

  const itemsSubtotal = document.getElementById("itemsSubtotal");
  if (itemsSubtotal) itemsSubtotal.textContent = formatMoney(subtotal);

  return { subtotal, taxRate, taxAmount, discountRate, discountAmount, total };
}
// ===============================
// RENDER TABLE
// ===============================
function renderOrders() {
  const tbody = document.querySelector("#ordersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const search = (document.getElementById("orderSearch")?.value || "").toLowerCase();
  const filter = document.getElementById("orderFilter")?.value || "all";

  const filteredOrders = orders.filter(order => {
    const id = String(order.id || "").toLowerCase();
    const name = String(order.customerName || "").toLowerCase();
    const matchesSearch = id.includes(search) || name.includes(search);
    const matchesFilter = filter === "all" || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  filteredOrders.forEach(order => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${order.id || "—"}</td>
      <td>${order.customerName || "—"}</td>
      <td>${formatMoney(order.total || 0)}</td>
      <td><span class="status-badge status-${order.status || "Pending"}">${order.status || "Pending"}</span></td>
      <td>${order.paymentMethod || "—"}</td>
      <td>${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</td>
      <td>
        <button class="primary-btn" onclick="editOrder('${order.id}')">Edit</button>
        <button class="secondary-btn" onclick="deleteOrder('${order.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (filteredOrders.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7" style="text-align:center; color:#888;">No orders found</td>`;
    tbody.appendChild(tr);
  }
  // ===============================
// Real KPI CARDS PENDING...
// ===============================
}
function updateKPI() {
  const total = orders.length;
  const pending = orders.filter(o => o.status === "Pending").length;
  const completed = orders.filter(o => o.status === "Delivered").length;

  document.getElementById("kpiTotalOrders").textContent = total;
  document.getElementById("kpiPendingOrders").textContent = pending;
  document.getElementById("kpiCompletedOrders").textContent = completed;
}


// ===============================
// CUSTOMER DROPDOWN
// ===============================
function populateCustomerDropdown() {
  const select = document.getElementById("orderCustomer");
  select.innerHTML = "";

  const customers = JSON.parse(localStorage.getItem("customersData") || "[]");

  customers.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.email;
    opt.textContent = c.name;
    select.appendChild(opt);
  });
}

// ===============================
// MODALS
// ===============================
function openOrderModal() {
  document.getElementById("orderModal").classList.add("show");
}

function closeOrderModal() {
  document.getElementById("orderModal").classList.remove("show");
}

function openItemsModal() {
  document.getElementById("itemsModal").classList.add("show");
  renderItemsTable();
}

function closeItemsModal() {
  document.getElementById("itemsModal").classList.remove("show");
}

// ===============================
// ITEMS TABLE
// ===============================
function renderItemsTable() {
  const tbody = document.querySelector("#itemsTable tbody");
  tbody.innerHTML = "";

  currentItems.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.sku}</td>
      <td>${item.name}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" data-index="${index}" class="item-qty-input">
      </td>
      <td>${formatMoney(item.price)}</td>
      <td>${formatMoney(item.total)}</td>
      <td><button data-index="${index}" class="item-remove-btn">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  calcTotals();
}
// ===============================
// ADD ITEM
// ===============================
function addItemFromProductName() {
  const input = document.getElementById("itemProductInput");
  const query = input.value.trim().toLowerCase();
  if (!query) return;

  const product = products.find(p => p.name.toLowerCase().includes(query));
  if (!product) {
    alert("Product not found");
    return;
  }

  const existing = currentItems.find(i => i.sku === product.sku);
  if (existing) {
    existing.qty += 1;
    existing.total = existing.qty * existing.price;
  } else {
    currentItems.push({
      sku: product.sku,
      name: product.name,
      qty: 1,
      price: product.price,
      total: product.price
    });
  }

  input.value = "";
  renderItemsTable();
}
// ===============================
// SAVE ORDER
// ===============================
function saveOrder() {
  const customerId = document.getElementById("orderCustomer").value;
  const paymentMethod = document.getElementById("orderPayment").value;
  const status = document.getElementById("orderStatus").value;

  if (!customerId) return toast("Please select a customer");
  if (currentItems.length === 0) return toast("Please add at least one item");

  const customers = JSON.parse(localStorage.getItem("customersData") || "[]");
  const customer = customers.find(c => c.email === customerId);

  const totals = calcTotals();

  const orderId = editOrderId || `FM-${new Date().getFullYear()}-${Date.now()}`;

  const order = {
    id: orderId,
    customerId,
    customerName: customer ? customer.name : "",
    items: currentItems,
    subtotal: totals.subtotal,
    taxRate: totals.taxRate,
    taxAmount: totals.taxAmount,
    discountRate: totals.discountRate,
    discountAmount: totals.discountAmount,
    total: totals.total,
    paymentMethod,
    status,
    timeline: [{ stage: "Placed", time: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  };

  if (editOrderId) {
    orders = orders.map(o => o.id === editOrderId ? order : o);
    editOrderId = null;
  } else {
    orders.push(order);
  }

  saveOrders();
  renderOrders();
  closeOrderModal();
  updateKPI();
}

// ===============================
// EDIT / DELETE
// ===============================
function editOrder(id) {
  const order = orders.find(o => o.id === id);
  if (!order) return;

  editOrderId = id;
  currentItems = order.items.map(i => ({ ...i }));

  document.getElementById("orderModalTitle").textContent = "Edit Order";
  document.getElementById("orderCustomer").value = order.customerId;
  document.getElementById("orderPayment").value = order.paymentMethod;
  document.getElementById("orderStatus").value = order.status;
  document.getElementById("orderTaxRate").value = (order.taxRate * 100).toFixed(0);
  document.getElementById("orderDiscountRate").value = (order.discountRate * 100).toFixed(0);

  calcTotals();
  openOrderModal();
}

function deleteOrder(id) {
  if (!confirm("Delete this order?")) return;
  orders = orders.filter(o => o.id !== id);
  saveOrders();
  renderOrders();
}
updateKPI();
/* ===============================
     PREMIUM TOAST SYSTEM
  =============================== */
function toast(msg) {
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
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  populateCustomerDropdown();
  renderOrders();

  document.getElementById("openOrderModal").onclick = () => {
    editOrderId = null;
    currentItems = [];
    document.getElementById("orderModalTitle").textContent = "Add Order";
    document.getElementById("orderTaxRate").value = 10;
    document.getElementById("orderDiscountRate").value = 0;
    calcTotals();
    openOrderModal();
  };

  document.getElementById("closeOrderModal").onclick = closeOrderModal;
  document.getElementById("openItemsModal").onclick = openItemsModal;
  document.getElementById("closeItemsModal").onclick = closeItemsModal;
  document.getElementById("itemsDoneBtn").onclick = () => {
    calcTotals();
    closeItemsModal();
  };

  document.getElementById("saveOrder").onclick = saveOrder;

  document.getElementById("orderSearch").addEventListener("input", renderOrders);
  document.getElementById("orderFilter").addEventListener("change", renderOrders);
  document.getElementById("orderTaxRate").addEventListener("input", calcTotals);
  document.getElementById("orderDiscountRate").addEventListener("input", calcTotals);

  document.getElementById("addItemBtn").onclick = addItemFromProductName;

  document.querySelector("#itemsTable").addEventListener("input", (e) => {
    if (e.target.classList.contains("item-qty-input")) {
      const index = parseInt(e.target.dataset.index, 10);
      const qty = Math.max(1, parseInt(e.target.value || "1", 10));
      currentItems[index].qty = qty;
      currentItems[index].total = qty * currentItems[index].price;
      renderItemsTable();
    }
  });

  document.querySelector("#itemsTable").addEventListener("click", (e) => {
    if (e.target.classList.contains("item-remove-btn")) {
      const index = parseInt(e.target.dataset.index, 10);
      currentItems.splice(index, 1);
      renderItemsTable();
    }
  });
});
