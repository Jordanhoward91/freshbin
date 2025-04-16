document.addEventListener("DOMContentLoaded", () => {
  const fetchRecipesButton = document.getElementById("fetch-recipes");
  const recipeList = document.getElementById("recipe-list");

  fetchRecipesButton.addEventListener("click", async () => {
    const recipes = await fetchRecipeSuggestions("chicken"); // Example keyword
    recipeList.innerHTML = "";
    recipes.forEach(recipe => {
      const li = document.createElement("li");
      li.textContent = recipe.strMeal;
      recipeList.appendChild(li);
    });
  });

  const fetchRecipeSuggestions = async (ingredient) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  };
});
