document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".products-container");
  const searchInput = document.getElementById("searchInput");

  const API_URL = "http://localhost:3000/api/products";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Serverdan mahsulotlar olinmadi");

    const products = await response.json();
    displayProducts(products);

    // 🔍 Qidiruv
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm)
      );
      displayProducts(filtered);
    });
  } catch (err) {
    console.error("❌ Fetch xatosi:", err.message);
    container.innerHTML = `<div class="no-products"><i class="fas fa-exclamation-circle"></i> ⚠️ Serverga ulanishda muammo yuz berdi</div>`;
  }

  // 🖼 Mahsulotlar chiqarilishi
  function displayProducts(products) {
    container.innerHTML = "";

    if (!products.length) {
      container.innerHTML = `
        <div class="no-products">
          <i class="fas fa-times-circle"></i>
          ❌ Mahsulot Topilmadi
        </div>
      `;
      return;
    }

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      const imageSrc = product.imageUrl
        ? `http://localhost:3000${product.imageUrl}` // serverdagi rasm
        : "./img/no-image.jpeg";                     // fallback rasm

      card.innerHTML = `
        <div class="card-actions">  
        </div>
        <img src="${imageSrc}" alt="${product.name}" loading="lazy" />
        <h4>${product.name}</h4>
        <p><strong>Brend:</strong> ${product.brand || "-"}</p>
        <p><strong>Model:</strong> ${product.model || "-"}</p>
        <p><strong>Kategoriya:</strong> ${product.category || "-"}</p>
        <p><strong>Narxi:</strong> ${product.price ? product.price.toLocaleString() + " so'm" : "—"}</p>
        <a href="./buyurtma.html" class="btn">Bog‘lanish</a>

      `;

      container.appendChild(card);
    });
  }
});
