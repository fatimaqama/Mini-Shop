console.log("Dashboard JS Loaded");

document.addEventListener("DOMContentLoaded", () => {

  // LOGIN PROTECTION
  if (localStorage.getItem("auth") !== "true") {
    window.location.replace("login.html");
  }
  // LOAD PROFILE NAME FROM SETTINGS
const storedName = localStorage.getItem("username");
const profileNameElement = document.getElementById("profileName");

if (storedName && profileNameElement) {
    profileNameElement.textContent = storedName;
}


  /* ===============================
     SHARED STRUCTURED DATA
  =============================== */
  let productsData = JSON.parse(localStorage.getItem("productsData") || "[]");
  let customersData = JSON.parse(localStorage.getItem("customersData") || "[]");
  let ordersData = JSON.parse(localStorage.getItem("ordersData") || "[]");

  function saveProductsData() {
    localStorage.setItem("productsData", JSON.stringify(productsData));
  }

  function saveCustomersData() {
    localStorage.setItem("customersData", JSON.stringify(customersData));
  }

  function saveOrdersData() {
    localStorage.setItem("ordersData", JSON.stringify(ordersData));
  }

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

  /* ===============================
     ELEMENTS
  =============================== */
  const addProductBtn = document.getElementById("addProduct");
  const addCustomerBtn = document.getElementById("addCustomer");
  const createOrderBtn = document.getElementById("createOrder");
  const viewReportsBtn = document.getElementById("viewReports");

  const productModal = document.getElementById("productModal");
  const customerModal = document.getElementById("customerModal");
  const orderModal = document.getElementById("orderModal");
  const reportModal = document.getElementById("reportModal");

  const productName = document.getElementById("productName");
  const category = document.getElementById("category");
  const price = document.getElementById("price");
  const stock = document.getElementById("stock");
  const saveProductBtn = document.getElementById("saveProduct");

  const customerName = document.getElementById("customerName");
  const customerEmail = document.getElementById("customerEmail");
  const customerPhone = document.getElementById("customerPhone");
  const customerAddress = document.getElementById("customerAddress");
  const saveCustomerBtn = document.getElementById("saveCustomer");

  const orderCustomer = document.getElementById("orderCustomer");
  const orderProduct = document.getElementById("orderProduct");
  const orderQty = document.getElementById("orderQty");
  const orderTotal = document.getElementById("orderTotal");
  const saveOrderBtn = document.getElementById("saveOrder");

  const reportType = document.getElementById("reportType");
  const reportStart = document.getElementById("reportStart");
  const reportEnd = document.getElementById("reportEnd");
  const generateReportBtn = document.getElementById("generateReport");

  /* ===============================
     MODAL OPEN/CLOSE
  =============================== */
  function openModal(modal) {
    modal.style.display = "flex";
    modal.classList.add("show");
  }

  function closeModal(modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }

  /* ===============================
     OPEN MODALS
  =============================== */
  addProductBtn.addEventListener("click", () => {
    productName.value = "";
    category.value = "Fruit & Vegetables";
    price.value = "";
    stock.value = "";
    openModal(productModal);
  });

  addCustomerBtn.addEventListener("click", () => {
    customerName.value = "";
    customerEmail.value = "";
    customerPhone.value = "+44 ";
    customerAddress.value = "";
    document.getElementById("customerOrders").value = "0";
    document.getElementById("customerLoyalty").value = "Active";
    openModal(customerModal);
  });

  createOrderBtn.addEventListener("click", () => {
    populateCustomerSelect();
    populateProductSelect();
    orderQty.value = 1;
    orderTotal.value = "";
    openModal(orderModal);
  });

  viewReportsBtn.addEventListener("click", () => {
    openModal(reportModal);
  });

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
     VALIDATION HELPERS
  =============================== */
  function error(input, msg) {
    input.classList.add("error");
    toast(msg);
    setTimeout(() => input.classList.remove("error"), 800);
  }

  function onlyLetters(input) {
    input.value = input.value.replace(/[^A-Za-z\s]/g, "");
  }

  function onlyNumbers(input) {
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  /* ===============================
     PRODUCT ICON SYSTEM
  =============================== */
  function getProductIcon(productName, category) {
    const p = productName.toLowerCase();
    const c = category.toLowerCase();

    const productIcons = {
      apple: "fa-apple-whole",
      banana: "fa-lemon",
      orange: "fa-lemon",
      mango: "fa-seedling",
      strawberry: "fa-seedling",
      tomato: "fa-seedling",
      carrot: "fa-carrot",
      broccoli: "fa-leaf",
      potato: "fa-seedling",
      onion: "fa-seedling",
      garlic: "fa-seedling",

      milk: "fa-bottle-water",
      cheese: "fa-cheese",
      butter: "fa-cheese",
      yogurt: "fa-jar",
      cream: "fa-jar",
      "ice cream": "fa-ice-cream",

      bread: "fa-bread-slice",
      cake: "fa-cake-candles",
      croissant: "fa-croissant",
      donut: "fa-cookie",
      muffin: "fa-cookie",

      "frozen pizza": "fa-pizza-slice",
      "frozen chicken": "fa-drumstick-bite",
      "frozen fish": "fa-fish",
      "frozen peas": "fa-snowflake",

      water: "fa-bottle-water",
      cola: "fa-bottle-water",
      coffee: "fa-mug-hot",
      tea: "fa-mug-saucer",
      juice: "fa-wine-glass",
      smoothie: "fa-blender",

      crisps: "fa-cookie",
      chocolate: "fa-cookie-bite",
      biscuits: "fa-cookie",
      popcorn: "fa-popcorn",
      nuts: "fa-seedling",
      candy: "fa-candy-cane"
    };

    if (productIcons[p]) {
      return `<i class="fas ${productIcons[p]}"></i>`;
    }

    if (c.includes("dairy")) return '<i class="fas fa-cheese"></i>';
    if (c.includes("bakery")) return '<i class="fas fa-bread-slice"></i>';
    if (c.includes("fruit")) return '<i class="fas fa-apple-whole"></i>';
    if (c.includes("vegetable")) return '<i class="fas fa-carrot"></i>';
    if (c.includes("frozen")) return '<i class="fas fa-snowflake"></i>';
    if (c.includes("drink")) return '<i class="fas fa-bottle-water"></i>';
    if (c.includes("snack")) return '<i class="fas fa-cookie"></i>';

    return '<i class="fas fa-box-open"></i>';
  }

  /* ===============================
     PRODUCT VALIDATION
  =============================== */
  productName.addEventListener("input", () => {
    onlyLetters(productName);
    productName.value = productName.value.replace(/\s{2,}/g, " ");
    if (productName.value.length > 0) {
      productName.value =
        productName.value.charAt(0).toUpperCase() + productName.value.slice(1);
    }
  });

  price.addEventListener("input", () => {
    let value = price.value.replace(/[^0-9.]/g, "");
    if (value.startsWith("-")) value = value.replace("-", "");
    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
    price.value = value;
  });

  stock.addEventListener("input", () => {
    onlyNumbers(stock);
    if (stock.value === "" || parseInt(stock.value) < 0) stock.value = "0";
  });

  saveProductBtn.addEventListener("click", () => {
    const name = productName.value.trim();
    let cat = category.value;
    const priceValue = price.value;
    const stockValue = stock.value;

    if (!name) return error(productName, "Product name required");
    if (!priceValue || parseFloat(priceValue) <= 0)
      return error(price, "Price must be greater than 0");
    if (!stockValue || parseInt(stockValue) < 0)
      return error(stock, "Stock cannot be negative");

    const fruitVegList = [
      "apple","banana","orange","pear","grape","mango","pineapple","kiwi","papaya",
      "melon","watermelon","strawberry","blueberry","raspberry","blackberry",
      "avocado","tomato","potato","onion","carrot","broccoli","spinach","lettuce",
      "cucumber","pepper","chilli","garlic","ginger","lime","lemon"
    ];

    const dairyList = [
      "milk","cheese","yogurt","butter","cream","custard","ghee","paneer",
      "mozzarella","cheddar","feta","ice cream"
    ];

    const bakeryList = [
      "bread","cake","donut","croissant","bagel","muffin","bun","roll","pastry",
      "brioche","sourdough","pita","naan"
    ];

    const frozenList = [
      "frozen peas","frozen chips","frozen pizza","frozen berries","ice cubes",
      "frozen chicken","frozen fish","frozen veg","frozen meals"
    ];

    const drinksList = [
      "water","cola","juice","orange juice","apple juice","milkshake","coffee",
      "tea","energy drink","smoothie"
    ];

    const snacksList = [
      "crisps","chips","chocolate","biscuits","cookies","popcorn","nuts","trail mix",
      "protein bar","candy","sweets"
    ];

    const lowerName = name.toLowerCase();

    if (fruitVegList.includes(lowerName)) cat = "Fruit & Vegetables";
    if (dairyList.includes(lowerName)) cat = "Dairy";
    if (bakeryList.includes(lowerName)) cat = "Bakery";
    if (frozenList.includes(lowerName)) cat = "Frozen";
    if (drinksList.includes(lowerName)) cat = "Drinks";
    if (snacksList.includes(lowerName)) cat = "Snacks";

    function blockWrongCategory(list, correctCategory) {
      if (list.includes(lowerName) && category.value !== correctCategory) {
        return error(category, `${name} must be in ${correctCategory}.`);
      }
    }

    if (blockWrongCategory(fruitVegList, "Fruit & Vegetables")) return;
    if (blockWrongCategory(dairyList, "Dairy")) return;
    if (blockWrongCategory(bakeryList, "Bakery")) return;
    if (blockWrongCategory(frozenList, "Frozen")) return;
    if (blockWrongCategory(drinksList, "Drinks")) return;
    if (blockWrongCategory(snacksList, "Snacks")) return;

    const duplicate = productsData.some(
      p => p.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) return error(productName, "Product already exists");

    let statusText = "";
    let statusClass = "";

    if (parseInt(stockValue) === 0) {
      statusText = "Out of Stock";
      statusClass = "out-stock";
    } else if (parseInt(stockValue) <= 10) {
      statusText = "Low Stock";
      statusClass = "low-stock";
    } else {
      statusText = "In Stock";
      statusClass = "in-stock";
    }

    const productObj = {
      name,
      category: cat,
      price: parseFloat(priceValue).toFixed(2),
      stock: parseInt(stockValue),
      statusText,
      statusClass,
      icon: getProductIcon(name, cat)
    };

    productsData.push(productObj);
    saveProductsData();

    toast("Product added ✔");
    closeModal(productModal);
  });

  /* ===============================
     CUSTOMER VALIDATION
  =============================== */
  customerName.addEventListener("input", () => {
    onlyLetters(customerName);
    customerName.value = customerName.value.replace(/\s{2,}/g, " ");
    if (customerName.value.length > 0) {
      customerName.value =
        customerName.value.charAt(0).toUpperCase() + customerName.value.slice(1);
    }
  });

  customerPhone.addEventListener("input", () => {
    let digits = customerPhone.value.replace(/[^0-9]/g, "");
    if (digits.startsWith("44")) digits = digits.slice(2);
    if (digits.length > 11) digits = digits.slice(0, 11);
    const formatted = digits.replace(/^(\d{5})(\d+)/, "$1 $2");
    customerPhone.value = "+44 " + formatted;
  });

  const customerOrders = document.getElementById("customerOrders");
  customerOrders.addEventListener("input", () => {
    onlyNumbers(customerOrders);
    if (parseInt(customerOrders.value) < 0) {
      customerOrders.value = "0";
    }
  });

  saveCustomerBtn.addEventListener("click", () => {
    const name = customerName.value.trim();
    const email = customerEmail.value.trim();
    const phone = customerPhone.value.trim();
    const address = customerAddress.value.trim();
    const ordersCount = parseInt(customerOrders.value);
    const loyalty = document.getElementById("customerLoyalty").value;

    if (!name)
      return error(customerName, "Customer name required");

    if (!email || !email.includes("@"))
      return error(customerEmail, "Valid email required");

    if (!phone.match(/^\+44\s\d{5}\s\d{6}$/))
      return error(customerPhone, "Phone must match +44 7xxxx xxxxx format");

    if (address.length < 10)
      return error(customerAddress, "Address too short (min 10 characters)");
    if (address.length > 200)
      return error(customerAddress, "Address too long (max 200 characters)");

    if (customerOrders.value.trim() === "")
      return error(customerOrders, "Please enter number of orders");

    if (ordersCount === 0)
      return error(customerOrders, "Orders cannot be 0");

    if (ordersCount < 0)
      return error(customerOrders, "Orders cannot be negative");

    const emailExists = customersData.some(c => c.email === email);
    if (emailExists)
      return error(customerEmail, "Email already registered");

    const phoneExists = customersData.some(c => c.phone === phone);
    if (phoneExists)
      return error(customerPhone, "Phone number already registered");

    const customerObj = {
  name,
  email,
  phone,
  address,
  orders: ordersCount,        // ⭐ FIXED: correct key name
  loyalty,
  createdAt: new Date().toISOString()  // ⭐ FIXED: needed for “New This Month”
};

    

    customersData.push(customerObj);
    saveCustomersData();

    toast("Customer added ✔");
    closeModal(customerModal);
    
  });

  /* ===============================
     DROPDOWNS FOR ORDERS
  =============================== */
  function populateCustomerSelect() {
    orderCustomer.innerHTML = `<option value="">Select Customer</option>`;
    customersData.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.email;
      opt.textContent = c.name;
      orderCustomer.appendChild(opt);
    });
  }

  function populateProductSelect() {
    orderProduct.innerHTML = `<option value="">Select Product</option>`;
    productsData.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = `${p.name} (£${p.price})`;
      orderProduct.appendChild(opt);
    });
  }

  saveOrderBtn.addEventListener("click", () => {
    const customerVal = orderCustomer.value;
    const productVal = orderProduct.value;
    const qtyVal = parseInt(orderQty.value);
    const totalVal = orderTotal.value;

    // VALIDATION
    if (!customerVal)
      return error(orderCustomer, "Select a customer");

    if (!productVal)
      return error(orderProduct, "Select a product");

    if (!qtyVal || qtyVal <= 0)
      return error(orderQty, "Quantity must be at least 1");

    if (!totalVal || parseFloat(totalVal) <= 0)
      return error(orderTotal, "Total must be valid");

    // FIND PRODUCT
    const productObj = productsData.find(p => p.name === productVal);
    if (!productObj)
      return error(orderProduct, "Product not found");

    // CHECK STOCK
    if (qtyVal > productObj.stock)
      return error(orderQty, "Not enough stock available");

    // UPDATE STOCK
    productObj.stock -= qtyVal;

    // UPDATE STOCK STATUS
    if (productObj.stock === 0) {
      productObj.statusText = "Out of Stock";
      productObj.statusClass = "out-stock";
    } else if (productObj.stock <= 10) {
      productObj.statusText = "Low Stock";
      productObj.statusClass = "low-stock";
    } else {
      productObj.statusText = "In Stock";
      productObj.statusClass = "in-stock";
    }

    saveProductsData();

    // CREATE ORDER OBJECT
    const orderObj = {
      customer: customerVal,
      product: productVal,
      qty: qtyVal,
      total: parseFloat(totalVal).toFixed(2),
      date: new Date().toLocaleDateString()
    };

    ordersData.push(orderObj);
    saveOrdersData();

    toast("Order created ✔");
    closeModal(orderModal);
  });
  /* ===============================
   DASHBOARD CARD REAL DATA
=============================== */

// TOTAL CUSTOMERS
document.getElementById("totalCustomersCard").textContent = customersData.length;

// TOTAL ORDERS
document.getElementById("totalOrdersCard").textContent = ordersData.length;

// TOTAL SALES
let totalSales = ordersData.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
document.getElementById("totalSalesCard").textContent = "£" + totalSales.toFixed(2);

});
/* ===============================
   DASHBOARD CARD REAL DATA
=============================== */

// NEW CUSTOMERS THIS MONTH
const newMonthEl = document.getElementById("newCustomersCard");
if (newMonthEl) {
  let currentMonth = new Date().getMonth();
  let newThisMonth = customersData.filter(c => {
    let created = new Date(c.createdAt);
    return created.getMonth() === currentMonth;
  }).length;

  newMonthEl.textContent = newThisMonth;
}
/* ===============================
   DASHBOARD STCOCK OVERVIEW CARD (CHART)
=============================== */
function renderStockChart() {
  const ctx = document.getElementById("stockChart");
  if (!ctx) return;

  const productsData = JSON.parse(localStorage.getItem("productsData") || "[]");
  if (productsData.length === 0) return;

  // Count stock categories
  let inStock = 0, lowStock = 0, outStock = 0;
  productsData.forEach(p => {
    const stock = parseInt(p.stock);
    if (stock === 0) outStock++;
    else if (stock <= 10) lowStock++;
    else inStock++;
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["In Stock", "Low Stock", "Out of Stock"],
      datasets: [{
        label: "Products",
        data: [inStock, lowStock, outStock],
        backgroundColor: [
          "rgba(24,169,153,0.7)",
          "rgba(253,216,53,0.7)",
          "rgba(255,82,82,0.7)"
        ],
        borderColor: [
          "rgba(24,169,153,1)",
          "rgba(253,216,53,1)",
          "rgba(255,82,82,1)"
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Product Count" } },
        x: { title: { display: true, text: "Stock Status" } }
      }
    }
  });
}

window.addEventListener("DOMContentLoaded", renderStockChart);

