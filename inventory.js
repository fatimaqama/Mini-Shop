document.addEventListener("DOMContentLoaded", () => {

    // Logout
    if (localStorage.getItem("auth") !== "true") {
    window.location.replace("login.html");
}


    const table = document.getElementById("inventoryTable");
    const search = document.querySelector(".toolbar input");

    if (!table) return;

    // Table Header
    table.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Shelf</th>
            <th>Supplier</th>
            <th>Last Restocked</th>
        </tr>
    `;

    // Load saved products
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {

        const temp = document.createElement("table");
        temp.innerHTML = savedProducts;

        const rows = temp.querySelectorAll("tr");

        let total = 0;
        let inStock = 0;
        let lowStock = 0;
        let outStock = 0;

        rows.forEach((row, index) => {

            if (index === 0) return;

            const cells = row.querySelectorAll("td");

            if (cells.length < 5) return;

            const product = cells[0].innerText;
            const stock = parseInt(cells[3].innerText);
            const status = cells[4].innerHTML;

            total++;

            if (stock === 0) outStock++;
            else if (stock <= 10) lowStock++;
            else inStock++;

            table.innerHTML += `
                <tr>
                    <td>${product}</td>
                    <td>${stock}</td>
                    <td>${status}</td>
                    <td>A${total}</td>
                    <td>FreshMart Supplier</td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
            `;
        });

        // Update summary cards
        document.querySelectorAll(".number")[0].textContent = total;
        document.querySelectorAll(".number")[1].textContent = inStock;
        document.querySelectorAll(".number")[2].textContent = lowStock;
        document.querySelectorAll(".number")[3].textContent = outStock;
    }

    // Search
    search.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        const rows = table.querySelectorAll("tr");

        rows.forEach((row, index) => {

            if (index === 0) return;

            row.style.display =
                row.innerText.toLowerCase().includes(value)
                    ? ""
                    : "none";
        });

    });
document.body.classList.add("loaded");
});