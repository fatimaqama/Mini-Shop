document.addEventListener("DOMContentLoaded", () => {

    // Protect page
    if (localStorage.getItem("auth") !== "true") {
    window.location.replace("login.html");
}


    // Logout
    window.logout = function () {
        localStorage.removeItem("auth");
        window.location.href = "login.html";
    };

const productsData = JSON.parse(localStorage.getItem("productsData") || "[]");

if (productsData.length === 0) {
  document.getElementById("salesCard").innerText = "£0";
  document.getElementById("productCard").innerText = "0";
  document.getElementById("lowCard").innerText = "0";
  document.getElementById("outCard").innerText = "0";
  return;
}

let revenue = 0;
let totalProducts = productsData.length;
let lowStock = 0;
let outStock = 0;
let inStock = 0;

// 1️⃣ CALCULATE REVENUE + STOCK COUNTS
productsData.forEach(p => {
  const price = parseFloat(p.price);
  const stock = parseInt(p.stock);

  revenue += price * stock;

  if (stock === 0) outStock++;
  else if (stock <= 10) lowStock++;
  else inStock++;
});

// 2️⃣ UPDATE CARDS
document.getElementById("salesCard").innerText = "£" + revenue.toFixed(2);
document.getElementById("productCard").innerText = totalProducts;
document.getElementById("lowCard").innerText = lowStock;
document.getElementById("outCard").innerText = outStock;

// 3️⃣ TREND CALCULATION (AFTER LOOP)
let lastWeekRevenue = parseFloat(localStorage.getItem("lastWeekRevenue") || "0");
let trendBox = document.getElementById("revenueTrend");

if (trendBox) {
  let diff = revenue - lastWeekRevenue;
  let percent = lastWeekRevenue > 0 ? (diff / lastWeekRevenue) * 100 : 0;

  if (percent > 0) {
    trendBox.innerHTML = `<i class="fas fa-arrow-up"></i> +${percent.toFixed(1)}% this week`;
    trendBox.classList.add("trend-up");
  } else if (percent < 0) {
    trendBox.innerHTML = `<i class="fas fa-arrow-down"></i> ${percent.toFixed(1)}% this week`;
    trendBox.classList.add("trend-down");
  } else {
    trendBox.innerHTML = `<i class="fas fa-circle"></i> Stable`;
    trendBox.classList.add("trend-neutral");
  }
}

// Save for next week
localStorage.setItem("lastWeekRevenue", revenue.toFixed(2));
const ctx = document.getElementById("reportChart");

if (ctx) {
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
});
