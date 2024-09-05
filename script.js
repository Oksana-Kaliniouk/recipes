document.addEventListener("DOMContentLoaded", () => {
  const recipeListSection = document.getElementById('recipeListSection');
  const recipeDetailsSection = document.getElementById('recipeDetailsSection');
  const recipeList = document.getElementById('recipeList');
  const backButton = document.getElementById('backButton');

  // Fetch and display the list of recipes
  fetchRecipes();

  function fetchRecipes() {
    // Fetch the list of JSON files in the recipes folder (adjust the URL to your GitHub repo)
    fetch('https://api.github.com/repos/Oksana-Kaliniouk/recipes/contents/recipes')
      .then(response => response.json())
      .then(data => {
        const jsonFiles = data.filter(file => file.name.endsWith('.json'));

        // Display each recipe name as a clickable list item
        jsonFiles.forEach(file => {
          const listItem = document.createElement('li');
          listItem.textContent = file.name.replace('.json', '');
          listItem.style.cursor = 'pointer'; // Make the item look clickable
          listItem.addEventListener('click', () => displayRecipe(file.name)); // On click, show the recipe
          recipeList.appendChild(listItem);
        });
      })
      .catch(error => console.error('Error fetching recipes:', error));
  }

  function displayRecipe(filename) {
    // Fetch the content of the clicked recipe file (adjust path if necessary)
    fetch(`./recipes/${filename}`)
      .then(response => response.json())
      .then(data => {
        // Populate the ingredients and steps
        const ingredientsHTML = generateIngredientHTML(data.ingredients, 1);
        const stepsHTML = generateStepsHTML(data.steps);

        document.getElementById('ingredientList').innerHTML = ingredientsHTML;
        document.getElementById('stepsList').innerHTML = stepsHTML;

        // Show the recipe details and hide the recipe list
        recipeListSection.style.display = 'none';
        recipeDetailsSection.style.display = 'block';
      })
      .catch(error => console.error('Error loading recipe:', error));
  }

  function generateIngredientHTML(ingredients, scaleFactor) {
    return ingredients.map(item =>
      `<li>${parseFloat(item.amount * scaleFactor)} ${item.measurement} ${item.ingredient}</li>`
    ).join('');
  }

  function generateStepsHTML(steps) {
    return steps.map(step => `<li>${step}</li>`).join('');
  }

  // Handle the "Back to List" button click
  backButton.addEventListener('click', () => {
    recipeDetailsSection.style.display = 'none';
    recipeListSection.style.display = 'block';
  });
});
