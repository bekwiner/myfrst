document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".products-container");
  const searchInput = document.getElementById("searchInput");

  // API manzili
  const API_URL = "http://localhost:3000/api/products";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Serverdan mahsulotlar olinmadi");

    const products = await response.json();
    displayProducts(products);

    // 🔍 Qidiruv bo‘yicha filter
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm)
      );
      displayProducts(filtered);
    });

  } catch (err) {
    console.error("❌ Fetch xatosi:", err.message);
    container.innerHTML = `<p class="error">⚠️ Serverga ulanishda muammo yuz berdi</p>`;
  }

  // Mahsulotlarni chiqarish funksiyasi
  function displayProducts(products) {
    if (!products.length) {
      container.innerHTML = "<p>❌ Mahsulotlar topilmadi</p>";
      return;
    }

    container.innerHTML = ""; // tozalash
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      // Mahsulot rasmi (agar telegramImageId bo‘lsa proksi orqali)
      const imageSrc = product.telegramImageId
        ? `http://localhost:3000/api/products/image/${product.telegramImageId}`
        : "./img/no-image.png";

      card.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}" loading="lazy" />
        <h4>${product.name}</h4>
        <p><strong>Brend:</strong> ${product.brand}</p>
        <p><strong>Model:</strong> ${product.model}</p>
        <p><strong>Kategoriya:</strong> ${product.category}</p>
        <p><strong>Narxi:</strong> ${product.price} so'm</p>
        <p><strong>Omborda:</strong> ${product.inStock ? "Bor" : "Yo'q"}</p>
        <a href="https://t.me/zapchast_uz" class="btn">Bog‘lanish</a>
      `;

      container.appendChild(card);
    });
  }
});
