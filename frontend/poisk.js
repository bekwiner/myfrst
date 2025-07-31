const products = [
  "SANY paletka",
  "SANY filtr",
  "SANY gidravlik nasos",
  "SANY motor",
  "Komatsu dvigatel",
  "Caterpillar reduktor",
  "Hyundai transmissiya",
  "Doosan gidravlika",
  "XCMG sovutkich",
  "Yuk mashina starter",
];

const input = document.getElementById("searchInput");
const suggestionBox = document.getElementById("suggestions");
const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const filterCategories = document.querySelectorAll(".filter-category");

input.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  suggestionBox.innerHTML = "";

  if (!query) return;

  const filtered = products.filter((product) =>
    product.toLowerCase().startsWith(query)
  );

  filtered.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", function () {
      input.value = item;
      suggestionBox.innerHTML = "";

      if (item.includes("SANY")) {
        window.location.href = "katalog/sany-item.html";
      } else {
        window.location.href = "buyurtma.html";
      }
    });
    suggestionBox.appendChild(li);
  });
});

filterBtn.addEventListener("click", () => {
  const query = input.value.toLowerCase();
  filterPanel.style.display = "block";

  filterCategories.forEach((cat) => {
    const brand = cat.getAttribute("data-brand").toLowerCase();
    if (query.includes("sany") && brand === "sany") {
      cat.classList.remove("hidden");
    } else if (!query || query === "") {
      cat.classList.remove("hidden");
    } else {
      cat.classList.add("hidden");
    }
  });
});
