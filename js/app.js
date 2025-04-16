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

  // Barcode scanning logic using QuaggaJS
  scanButton.addEventListener("click", () => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: barcodeVideo // Attach the video element
      },
      decoder: {
        readers: ["ean_reader", "code_128_reader"] // Specify barcode formats
      }
    }, (err) => {
      if (err) {
        console.error("Error initializing Quagga:", err);
        alert("Failed to start barcode scanning. Please try again.");
        return;
      }
      Quagga.start(); // Start the scanner
    });

    // Listen for barcode detection
    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      console.log("Barcode detected:", code);
      alert(`Detected Barcode: ${code}`); // Display result
      Quagga.stop(); // Stop the scanner after detection
    });
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
