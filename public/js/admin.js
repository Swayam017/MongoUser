const token = localStorage.getItem("token");

// ================= AUTH CHECK =================
if (!token) {
    alert("Access denied ❌ Please login");
    window.location = "login.html";
}

// ================= LOAD PRODUCTS =================
async function loadAdminProducts() {
    try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const container = document.getElementById("admin-products");
        container.innerHTML = "";

        data.forEach(p => {
            const div = document.createElement("div");
            div.className = "product";

            // ✅ avoid breaking HTML (safe string)
            const safeTitle = p.title?.replace(/'/g, "\\'");
            const safeDesc = p.description?.replace(/'/g, "\\'");
            const safeImage = p.imageUrl?.replace(/'/g, "\\'");

            div.innerHTML = `
                <img src="${p.imageUrl}">
                <h4>${p.title}</h4>
                <p>₹${p.price}</p>

                <button onclick="deleteProduct('${p._id}')">Delete</button>
                <button onclick="editProduct('${p._id}', '${safeTitle}', '${p.price}', '${safeImage}', '${safeDesc}')">Edit</button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.log(err);
        alert("Error loading products ❌");
    }
}

// ================= ADD PRODUCT =================
async function addProduct() {
    const formData = new FormData();

    formData.append("title", document.getElementById("title").value.trim());
    formData.append("price", document.getElementById("price").value.trim());
    formData.append("description", document.getElementById("description").value.trim());

    const file = document.getElementById("image").files[0];
    if (file) {
        formData.append("image", file);
    }

    try {
        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) return alert(data.message);

        alert("Product added ✅");

        loadAdminProducts();

    } catch (err) {
        console.log(err);
        alert("Error ❌");
    }
}

// ================= DELETE PRODUCT =================
async function deleteProduct(id) {
    const confirmDelete = confirm("Are you sure to delete?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`/api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        const data = await res.json();

        if (!res.ok) {
            return alert(data.message || "Delete failed ❌");
        }

        alert("Deleted successfully ❌");
        loadAdminProducts();

    } catch (err) {
        console.log(err);
        alert("Error deleting ❌");
    }
}

// ================= EDIT PRODUCT =================
async function editProduct(id, oldTitle, oldPrice, oldImage, oldDesc) {

    const title = prompt("Enter title", oldTitle);
    if (title === null) return;

    const price = prompt("Enter price", oldPrice);
    if (price === null) return;

    const imageUrl = prompt("Enter image URL", oldImage);
    if (imageUrl === null) return;

    const description = prompt("Enter description", oldDesc);
    if (description === null) return;

    try {
        const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                title,
                price,
                imageUrl,
                description
            })
        });

        const data = await res.json();

        if (!res.ok) {
            return alert(data.message || "Update failed ❌");
        }

        alert("Updated successfully ✅");
        loadAdminProducts();

    } catch (err) {
        console.log(err);
        alert("Error updating ❌");
    }
}

// ================= LOAD USERS =================
async function loadUsers() {
    try {
        const res = await fetch("/api/users", {
            headers: {
                "Authorization": token
            }
        });

        const data = await res.json();

        const container = document.getElementById("users");

        container.innerHTML = data.map(u => `
            <div style="margin-bottom:10px;">
                <strong>${u.name}</strong><br>
                <small>${u.email}</small><br>
                <span style="color:green;">${u.role}</span>
            </div>
        `).join("");

    } catch (err) {
        console.log(err);
        alert("Error loading users ❌");
    }
}
function goAdminOrders() {
    window.location = "admin-orders.html";
}

// ================= INIT =================
loadAdminProducts();
loadUsers();