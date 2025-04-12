document.addEventListener("DOMContentLoaded", () => {
  const pantryList = document.getElementById("pantry-list");
  const expiringItemsList = document.getElementById("expiring-items");
  const recipeList = document.getElementById("recipe-list");

  // Load mock pantry data (replace with API integration later)
  fetch('data/mockData.json')
    .then(response => response.json())
    .then(data => {
      populatePantry(data.pantry);
      populateExpiringItems(data.pantry);
      populateRecipes(data.recipes);
    });

  // Populate pantry section
  const populatePantry = (pantry) => {
    pantry.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - Expires: ${item.expiration}`;
      pantryList.appendChild(li);
    });
  };

  // Populate expiring items
  const populateExpiringItems = (pantry) => {
    const expiringSoon = pantry.filter(item => isExpiringSoon(item.expiration));
    expiringSoon.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - Expires: ${item.expiration}`;
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
    recipes.forEach(recipe => {
      const li = document.createElement("li");
      li.textContent = recipe.name;
      recipeList.appendChild(li);
    });
  };
});
