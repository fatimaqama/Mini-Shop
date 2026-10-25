console.log("PRODUCTS JS LOADED");

let stockChart;

document.addEventListener("DOMContentLoaded", () => {
  // LOGIN PROTECTION
 if (localStorage.getItem("auth") !== "true") {
    window.location.replace("login.html");
}


  // LOGOUT FUNCTION
  window.logout = function () {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    window.location.replace("login.html");
  };

  // ELEMENTS
  const modal = document.getElementById("productModal");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.querySelector(".close");
  const saveBtn = document.getElementById("saveProduct");
  const resetBtn = document.getElementById("resetProducts");
  const table = document.querySelector(".product-table");

  const productName = document.getElementById("productName");
  const category = document.getElementById("category");
  const price = document.getElementById("price");
  const stock = document.getElementById("stock");
  const searchInput = document.querySelector(".toolbar input");

  // ============================
  // STRUCTURED DATA
  // ============================
  let productsData = JSON.parse(localStorage.getItem("productsData") || "[]");

  function saveProductsData() {
    localStorage.setItem("productsData", JSON.stringify(productsData));
  }
function getTintClass(category) {
  const c = category.toLowerCase();

  if (c.includes("dairy")) return "icon-dairy";
  if (c.includes("fruit")) return "icon-fruit";
  if (c.includes("vegetable")) return "icon-fruit";
  if (c.includes("bakery")) return "icon-bakery";
  if (c.includes("frozen")) return "icon-frozen";
  if (c.includes("drink")) return "icon-drinks";
  if (c.includes("snack")) return "icon-snacks";

  return "";
}

function renderTable() {
  table.innerHTML = `
    <tr>
      <th>Product</th>
      <th>Category</th>
      <th>Price</th>
      <th>Stock</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  `;

  productsData.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="${getTintClass(p.category)}">
        ${getProductIcon(p.name, p.category)} ${p.name}
      </td>

      <td>${p.category}</td>
      <td>£${p.price}</td>
      <td>${p.stock}</td>
      <td><span class="status ${p.statusClass}">${p.statusText}</span></td>
      <td>
        <button class="edit-btn"><i class="fas fa-pen-to-square"></i></button>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      </td>
    `;
    table.appendChild(row);
  });

  calculateDataFromTable();
}


  // CATEGORY ICONS
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


  // INITIAL RENDER
  renderTable();

  // SEARCH
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const value = searchInput.value.toLowerCase();
      const rows = table.querySelectorAll("tr");

      rows.forEach((row, index) => {
        if (index === 0) return;
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
      });

      calculateDataFromTable();
    });
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
  

  // DELETE PRODUCT
  table.addEventListener("click", (e) => {
    if (e.target.closest(".delete-btn")) {
      const row = e.target.closest("tr");
      const nameCell = row.children[0].innerText;
      const name = nameCell.replace(/^[^\s]+/, "").trim().toLowerCase();

      productsData = productsData.filter(p => p.name.toLowerCase() !== name);
      saveProductsData();
      renderTable();
    }
  });

  // EDIT PRODUCT
  let currentIndex = null;

  table.addEventListener("click", (e) => {
    if (e.target.closest(".edit-btn")) {
      const row = e.target.closest("tr");
      const nameCell = row.children[0].innerText;
      const name = nameCell.replace(/^[^\s]+/, "").trim();

      currentIndex = productsData.findIndex(p => p.name === name);

      if (currentIndex !== -1) {
        const p = productsData[currentIndex];
        productName.value = p.name;
        category.value = p.category;
        price.value = p.price;
        stock.value = p.stock;
        modal.classList.add("show");
      }
    }
  });

  // OPEN MODAL
  openBtn.addEventListener("click", () => {
    currentIndex = null;
    productName.value = "";
    price.value = "";
    stock.value = "";
    category.value = "Fruit & Vegetables";
    modal.classList.add("show");
  });

  // CLOSE MODAL
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });

  // ============================
  // PREMIUM LIVE VALIDATION
  // ============================

  // PRODUCT NAME — letters only, auto uppercase
  productName.addEventListener("input", () => {
    productName.value = productName.value.replace(/[^A-Za-z\s]/g, "");
    productName.value = productName.value.replace(/\s{2,}/g, " ");
    if (productName.value.length > 0) {
      productName.value =
        productName.value.charAt(0).toUpperCase() + productName.value.slice(1);
    }
  });

  // PRICE — allow decimals, block negatives
  price.addEventListener("input", () => {
    let value = price.value.replace(/[^0-9.]/g, "");

    if (value.startsWith("-")) value = value.replace("-", "");

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    price.value = value;
  });

  // STOCK — whole numbers only, block negatives
  stock.addEventListener("input", () => {
    stock.value = stock.value.replace(/[^0-9]/g, "");

    if (stock.value === "") stock.value = "0";

    if (parseInt(stock.value) < 0) stock.value = "0";

    if (parseInt(stock.value) > 9999) stock.value = "9999";
  });

  // ============================
  // SAVE PRODUCT (STRUCTURED)
  // ============================
saveBtn.addEventListener("click", () => {
  const name = productName.value.trim();
  let cat = category.value;
  const priceValue = price.value;
  const stockValue = stock.value;

  // BASIC VALIDATION
  if (!name) return toast("Please enter a product name.");
  if (!priceValue || parseFloat(priceValue) <= 0)
    return toast("Please enter a valid price.");
  if (!stockValue || parseInt(stockValue) < 0)
    return toast("Please enter a valid stock quantity.");

  // SMART CATEGORY DETECTION
  const fruitList = ["apple", "banana", "orange", "pear", "grape"];
  const dairyList = ["milk", "cheese", "yogurt", "butter"];
  const bakeryList = ["bread", "cake", "donut", "croissant"];

  const lowerName = name.toLowerCase();

  if (fruitList.includes(lowerName)) cat = "Fruit & Vegetables";
  if (dairyList.includes(lowerName)) cat = "Dairy";
  if (bakeryList.includes(lowerName)) cat = "Bakery";

  // CATEGORY MISMATCH BLOCKING
  if (fruitList.includes(lowerName) && category.value !== "Fruit & Vegetables")
    return toast("Fruit items must be in Fruit & Vegetables.");

  if (dairyList.includes(lowerName) && category.value !== "Dairy")
    return toast("Dairy items must be in Dairy.");

  if (bakeryList.includes(lowerName) && category.value !== "Bakery")
    return toast("Bakery items must be in Bakery.");

  // DUPLICATE CHECK
  if (currentIndex === null) {
    const duplicate = productsData.some(
      p => p.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) return toast("This product already exists.");
  }

  // STATUS
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
    statusClass
  };

  if (currentIndex !== null) {
    productsData[currentIndex] = productObj;
  } else {
    productsData.push(productObj);
  }

  saveProductsData();
  renderTable();

  modal.classList.remove("show");
  productName.value = "";
  price.value = "";
  stock.value = "";
});


    // STATUS
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
      statusClass
    };

    if (currentIndex !== null) {
      productsData[currentIndex] = productObj;
    } else {
      productsData.push(productObj);
    }

    saveProductsData();
    renderTable();

    modal.classList.remove("show");
    productName.value = "";
    price.value = "";
    stock.value = "";
  });

  // RESET PRODUCTS
  resetBtn.addEventListener("click", () => {
    productsData = [];
    saveProductsData();
    renderTable();
  });


// ================= CHART SYSTEM =================
function renderChart(inStock, lowStock, outStock) {
  const ctx = document.getElementById("stockChart");
  if (!ctx) return;

  if (stockChart) stockChart.destroy();

  stockChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["In Stock", "Low Stock", "Out of Stock"],
      datasets: [
        {
          data: [inStock, lowStock, outStock],
          backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
        },
      ],
    },
  });
}

// ================= ANALYTICS =================
function calculateDataFromTable() {
  const rows = document.querySelectorAll(".product-table tr");

  let inStock = 0;
  let low = 0;
  let out = 0;

  rows.forEach((row, i) => {
    if (i === 0) return;

    const stockValue = parseInt(row.children[3].innerText);
    const statusText = row.children[4].innerText.toLowerCase();

    if (stockValue == 0 || statusText.includes("out")) out++;
    else if (stockValue <= 10) low++;
    else inStock++;
  });

  renderChart(inStock, low, out);
  document.body.classList.add("loaded");
}
