const token = localStorage.getItem("token");

async function loadOrders() {
    const res = await fetch("/api/orders", {
        headers: { Authorization: token }
    });

    const data = await res.json();

    const container = document.getElementById("orders-container");
    container.innerHTML = "";

    data.forEach(order => {
        const div = document.createElement("div");
        div.className = "order-card";

        div.innerHTML = `
            <h3>Order ID: ${order._id}</h3>
            <p>Status: ${order.status}</p>
            <p>Total: ₹${order.total}</p>

            <ul>
                ${order.items.map(item => `
                    <li>
                        ${item.title} - ₹${item.price} × ${item.quantity}
                    </li>
                `).join("")}
            </ul>
        `;

        container.appendChild(div);
    });
}

loadOrders();