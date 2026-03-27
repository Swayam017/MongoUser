let allProducts = [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

const token = localStorage.getItem("token");

// ================= NAVBAR =================
function loadNavbarAuth() {
    const container = document.getElementById("nav-auth");
        const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        container.innerHTML = `
            <button class="btn btn-outline-light" onclick="goLogin()">Login</button>
            <button class="btn btn-primary" onclick="goSignup()">Sign Up</button>
        `;
    } else {
        container.innerHTML = `
          ${role === "admin" ? 
                `<button class="btn btn-warning" onclick="goAdmin()">Admin</button>` 
                : ""
            }
            <button class="btn btn-outline-light" onclick="goCart()">Cart</button>
            <button class="btn btn-outline-light" onclick="goOrders()">Orders</button>
            <button class="btn btn-outline-info" onclick="goProfile()">Profile</button>
            <button class="btn btn-danger" onclick="logout()">Logout</button>
        `;
    }
}

// ================= PRODUCTS =================
async function loadProducts(containerId = "latest-products") {
    const res = await fetch("/api/products");
    const data = await res.json();

    allProducts = data;

    displayProducts(data, containerId);

    if (containerId === "latest-products") {
        displayProducts(recent, "recent-products");
    }
}

// ================= DISPLAY =================
function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <img src="${p.imageUrl}" 
                 style="width:100%;height:150px;object-fit:cover;cursor:pointer;" 
                 onclick="viewProduct('${p._id}')">

            <h5>${p.title}</h5>
            <p>₹${p.price}</p>

            <button onclick="addToCart('${p._id}')">Add to Cart</button>
        `;

        container.appendChild(div);
    });
}

// ================= SEARCH =================
function searchProducts() {
    const keyword = document.getElementById("search").value.toLowerCase();

    const filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(keyword)
    );

    displayProducts(filtered, "latest-products");
}

// ================= RECENT =================
function viewProduct(id) {
    const product = allProducts.find(p => p._id === id);

    recent.unshift(product);
    recent = recent.slice(0, 5);

    localStorage.setItem("recent", JSON.stringify(recent));

    displayProducts(recent, "recent-products");
}

// ================= CART =================
async function addToCart(productId) {
    if (!token) {
        alert("Please login first");
        window.location = "login.html";
        return;
    }

    await fetch("/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ productId })
    });

    alert("Added to cart 🛒");
}

// ================= NAVIGATION =================
function goLogin() { window.location = "login.html"; }
function goSignup() { window.location = "signup.html"; }
function goCart() { window.location = "cart.html"; }
function goProfile() { window.location = "profile.html"; }
function goAdmin() { window.location.href = "admin.html";}
function goOrders() {window.location = "orders.html";}

function logout() {
    localStorage.clear();
    alert("Logged out");
    window.location = "index.html";
}

// ================= CAROUSEL =================
const images = [
    "/images/ecom.png",
    "/images/ecom3.jpg",
    "/images/ecom2.jpg"
];

let i = 0;
setInterval(() => {
    i = (i + 1) % images.length;
    document.getElementById("slide").src = images[i];
}, 3000);

// ================= INIT =================
loadNavbarAuth();
loadProducts();