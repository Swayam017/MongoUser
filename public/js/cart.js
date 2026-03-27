if (!localStorage.getItem("token")) {
    alert("Please login first");
    window.location = "login.html";
}

const token = localStorage.getItem("token");

async function loadCart() {
    const res = await fetch(`/api/cart`, {
        headers: {
            "Authorization": token
        }
    });

    const data = await res.json();

    const container = document.getElementById("cart-container");
    container.innerHTML = "";

    let total = 0;

    data.forEach(item => {
        const p = item.product;

        total += p.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="${p.imageUrl}">
            <h3>${p.title}</h3>
            <p>₹${p.price}</p>

                <div class="quantity-box">
        <button onclick="changeQuantity('${p._id}', -1)">➖</button>

        <span id="qty-${p._id}">${item.quantity}</span>

        <button onclick="changeQuantity('${p._id}', 1)">➕</button>
    </div>

    <button onclick="removeItem('${p._id}')">Remove</button>

        `;

        container.appendChild(div);
    });

    document.getElementById("total").innerText = "Total: ₹" + total;
  
}

// UPDATE
async function updateQuantity(productId, quantity) {
    await fetch("/api/cart", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ productId, quantity })
    });

    loadCart();
}

async function changeQuantity(productId, change) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyElement.innerText);

    let newQty = currentQty + change;

    // ❌ prevent 0 or negative
    if (newQty < 1) {
        removeItem(productId);
        return;
    }

    await fetch("/api/cart", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ productId, quantity: newQty })
    });

    loadCart(); // refresh UI
}

async function placeOrder() {
    const res = await fetch("/api/order", {
        method: "POST",
        headers: {
            "Authorization": token
        }
    });

    const data = await res.json();

    if (res.ok) {
        alert("Order placed successfully 🎉");

        // reload cart
        loadCart();

        // optional redirect
        // window.location = "orders.html";
    } else {
        alert(data.message);
    }
}
// REMOVE
async function removeItem(productId) {
    await fetch("/api/cart", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ productId })
    });

    loadCart();
}

loadCart();