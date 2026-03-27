const token = localStorage.getItem("token");

// 🔒 protect admin page
if (localStorage.getItem("role") !== "admin") {
    alert("Access Denied");
    window.location = "index.html";
}

async function loadOrders() {
    const res = await fetch("/api/admin/orders", {
        headers: { Authorization: token }
    });

    const data = await res.json();

    const container = document.getElementById("admin-orders");
    container.innerHTML = "";

    data.forEach(order => {
        const div = document.createElement("div");
        div.className = "order-card";
        div.innerHTML = `
            <h3>${order._id}</h3>
            <p>Status: ${order.status}</p>
            <p>Total: ₹${order.total}</p>

            <select onchange="updateStatus('${order._id}', this.value)">
                <option ${order.status === "Placed" ? "selected" : ""}>Placed</option>
                <option ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
                <option ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
            </select>

            <hr>
        `;

        container.appendChild(div);
    });
}

async function updateStatus(orderId, status) {
    await fetch("/api/admin/order", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ orderId, status })
    });

    alert("Status updated");
    loadOrders();
}

loadOrders();