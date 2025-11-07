// /////////////////////////////////////////////////////////////////////////
// Fetch Recipe
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const recipeContainer = document.getElementById("recipeContainer");
const resultSection = document.getElementById("result");

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchRecipe(query);
  } else {
    alert("Please enter the food name 😋🤤.");
  }
});

// allow Enter to search
searchInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

async function fetchRecipe(keyword) {
  recipeContainer.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`);
    const data = await response.json();

    if (data && data.meals) {
      displayRecipe(data.meals);
      // smooth scroll to results so user sees them immediately
      resultSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      recipeContainer.innerHTML = "<p>No recipe found. Try another keyword.</p>";
      resultSection.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (error) {
    recipeContainer.innerHTML = "<p>Something went wrong. Please try again.</p>";
    console.error(error);
  }
}

// display recipe
function displayRecipe(meals) {
  recipeContainer.innerHTML = ""; // clear
  meals.forEach(meal => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${escapeHtml(meal.strMeal)}" />
      <h3>${escapeHtml(meal.strMeal)}</h3>
      <p><strong>Ingredients:</strong> ${escapeHtml(getIngredients(meal).join(', '))}</p>
    `;
    recipeContainer.appendChild(card);
  });
}

// Extract ingredients from meal object
function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`] || '';
    if (name && name.trim()) {
      ingredients.push((measure.trim() ? `${measure.trim()} ` : '') + name.trim());
    }
  }
  return ingredients;
}

// small helper to avoid HTML injection if API returns weird strings
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
