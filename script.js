document.addEventListener("DOMContentLoaded", () => {
  const recipeListSection = document.getElementById('recipeListSection');
  const recipeDetailsSection = document.getElementById('recipeDetailsSection');
  const recipeList = document.getElementById('recipeList');
  const recipeDisplay = document.getElementById('recipeDisplay');
  const backButton = document.getElementById('backButton');

  // Fetch recipes list and display as clickable items
  fetchRecipes();

  function fetchRecipes() {
    fetch('https://api.github.com/repos/Oksana-Kaliniouk/recipes/contents/recipes')
      .then(response => response.json())
      .then(data => {
        const jsonFiles = data.filter(file => file.name.endsWith('.json'));
        jsonFiles.forEach(file => {
          const listItem = document.createElement('li');
          listItem.textContent = file.name.replace('.json', '');
          listItem.addEventListener('click', () => displayRecipe(file.name));
          recipeList.appendChild(listItem);
        });
      });
  }

  function displayRecipe(filename) {
    fetch(`./recipes/${filename}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('ingredientList').innerHTML = generateIngredientHTML(data.ingredients, 1);
        document.getElementById('stepsList').innerHTML = generateStepsHTML(data.steps);
        
        // Show the recipe details and hide the list
        recipeListSection.style.display = 'none';
        recipeDetailsSection.style.display = 'block';
      });
  }

  function generateIngredientHTML(ingredients, scaleFactor) {
    return ingredients.map(item =>
      `<li>${parseFloat(item.amount * scaleFactor)} ${item.measurement} ${item.ingredient}</li>`
    ).join('');
  }

  function generateStepsHTML(steps) {
    return steps.map(step => `<li>${step}</li>`).join('');
  }

  // Back to recipe list
  backButton.addEventListener('click', () => {
    recipeListSection.style.display = 'block';
    recipeDetailsSection.style.display = 'none';
  });
});
