// Recipe API function (TheMealDB)
const fetchRecipeSuggestions = async (ingredient) => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
    return data.meals; // Array of recipe suggestions
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return [];
  }
};
