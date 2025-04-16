document.addEventListener("DOMContentLoaded", () => {
  const barcodeVideo = document.getElementById("barcode-video");
  const scanButton = document.getElementById("scan-item");
  const fetchRecipesButton = document.getElementById("fetch-recipes");
  const recipeList = document.getElementById("recipe-list");
  const pantryList = document.getElementById("pantry-list");
  const expiringItemsList = document.getElementById("expiring-items");

  // Fetch mock data and populate sections
  fetch('data/mockData.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch mock data");
      }
      return response.json();
    })
    .then(data => {
      populatePantry(data.pantry);
      populateExpiringItems(data.pantry);
      populateRecipes(data.recipes);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });

  // Populate pantry section
  const populatePantry = (pantry) => {
    pantryList.innerHTML = ""; // Clear existing data
    pantry.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - Expires: ${item.expiration}`;
      pantryList.appendChild(li);
    });
  };

  // Populate expiring items section
  const populateExpiringItems = (pantry) => {
    expiringItemsList.innerHTML = ""; // Clear existing data
    const expiringSoon = pantry.filter(item => isExpiringSoon(item.expiration));
    expiringSoon.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - Expires: ${item.expiration}`;
      li.style.color = "red"; // Highlight expiring items
      expiringItemsList.appendChild(li);
    });
  };

  // Check if an item is expiring soon
  const isExpiringSoon = (expiration) => {
    const today = new Date();
    const expiryDate = new Date(expiration);
    const diff = expiryDate - today;
    return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000; // 7 days
  };

  // Populate recipes section
  const populateRecipes = (recipes) => {
    recipeList.innerHTML = ""; // Clear existing data
    recipes.forEach(recipe => {
      const li = document.createElement("li");
      li.textContent = recipe.name;
      recipeList.appendChild(li);
    });
  };

  // Barcode scanning logic
  scanButton.addEventListener("click", async () => {
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'qr_code'] });

      try {
        // Access the user's camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        barcodeVideo.srcObject = stream;

        barcodeVideo.onloadedmetadata = async () => {
          barcodeVideo.play(); // Ensure video playback starts
          try {
            const barcodes = await barcodeDetector.detect(barcodeVideo);
            if (barcodes.length > 0) {
              console.log("Scanned barcode:", barcodes[0].rawValue);
              alert(`Scanned Barcode: ${barcodes[0].rawValue}`); // Display result to the user
            } else {
              alert("No barcode detected. Please try again.");
            }
          } catch (err) {
            console.error("Barcode detection failed:", err);
          }
        };
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access the camera. Please check your browser permissions.");
      }
    } else {
      alert("Barcode Detector API is not supported in your browser.");
    }
  });


  // Fetch recipes logic
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
