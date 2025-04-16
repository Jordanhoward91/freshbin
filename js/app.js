document.addEventListener("DOMContentLoaded", () => {
  const barcodeVideo = document.getElementById("barcode-video");
  const scanButton = document.getElementById("scan-item");
  const fetchRecipesButton = document.getElementById("fetch-recipes");
  const recipeList = document.getElementById("recipe-list");

  // Start barcode scanning
  scanButton.addEventListener("click", async () => {
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'qr_code'] });

      // Access the user's camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      barcodeVideo.srcObject = stream;

      barcodeVideo.addEventListener("loadeddata", async () => {
        try {
          const barcodes = await barcodeDetector.detect(barcodeVideo);
          if (barcodes.length > 0) {
            console.log("Scanned barcode:", barcodes[0].rawValue);
          }
        } catch (err) {
          console.error("Barcode detection failed:", err);
        }
      });
    } else {
      alert("Barcode Detector API is not supported in your browser.");
    }
  });

  // Fetch recipes
  fetchRecipesButton.addEventListener("click", async () => {
    const recipes = await fetchRecipeSuggestions("chicken"); // Example search keyword
    recipeList.innerHTML = ""; // Clear previous recipes
    recipes.forEach(recipe => {
      const li = document.createElement("li");
      li.textContent = recipe.strMeal; // Recipe name
      recipeList.appendChild(li);
    });
  });
});
