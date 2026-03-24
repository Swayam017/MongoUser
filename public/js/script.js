const API = "http://localhost:5000/api/cart";
const userId = "YOUR_USER_ID_HERE"; // ⚠️ Replace with actual user id

// ---------------- PRODUCTS ----------------
async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  const products = await res.json();

  const container = document.getElementById("products");
  if (!container) return;

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart('${product._id}')">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

// ➤ Add to Cart
async function addToCart(productId) {
  await fetch(`${API}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId })
  });

  alert("Added to cart");
}

// ---------------- CART ----------------
async function loadCart() {
  const res = await fetch(`${API}/${userId}`);
  const cart = await res.json();

  const container = document.getElementById("cart");
  if (!container) return;

  container.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.product.name}</h3>
      <p>₹${item.product.price}</p>

      <input type="number" value="${item.quantity}" 
        onchange="updateCart('${item.product._id}', this.value)" />

      <button onclick="deleteItem('${item.product._id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

// ➤ Update quantity
async function updateCart(productId, quantity) {
  await fetch(`${API}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity })
  });

  loadCart();
}

// ➤ Delete item
async function deleteItem(productId) {
  await fetch(`${API}/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId })
  });

  loadCart();
}

// ---------------- INIT ----------------
loadProducts();
loadCart();