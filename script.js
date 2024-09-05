document.addEventListener("DOMContentLoaded", () => {
  const recipeList = document.getElementById('recipeList');
  const recipeDisplay = document.getElementById('recipeDisplay');

  const recipes = ['bread.json', 'cake.json'];  // List of your JSON files

  // Populate recipe list
  recipes.forEach(recipe => {
    const listItem = document.createElement('li');
    listItem.textContent = recipe.replace('.json', '');
    listItem.addEventListener('click', () => displayRecipe(recipe));
    recipeList.appendChild(listItem);
  });

  // Fetch and display recipe
  function displayRecipe(filename) {
    fetch(`./recipes/${filename}`)
      .then(response => response.json())
      .then(data => {
        recipeDisplay.innerHTML = `
          <h2>${data.title}</h2>
          <h3>Ingredients:</h3>
          <ul>${data.ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
          <h3>Steps:</h3>
          <ol>${data.steps.map(step => `<li>${step}</li>`).join('')}</ol>
        `;
      })
      .catch(error => {
        recipeDisplay.innerHTML = `<p>Failed to load recipe: ${error}</p>`;
      });
  }
});
