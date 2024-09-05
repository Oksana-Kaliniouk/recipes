document.addEventListener("DOMContentLoaded", () => {
  const recipeListSection = document.getElementById('recipeListSection');
  const recipeDetailsSection = document.getElementById('recipeDetailsSection');
  const recipeList = document.getElementById('recipeList');
  const recipeDisplay = document.getElementById('recipeDisplay');
  const backButton = document.getElementById('backButton');

  const repoOwner = 'Oksana-Kaliniouk';  // Replace with your GitHub username
  const repoName = 'recipes';  // Replace with your GitHub repository name
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/recipes`;

  // Fetch list of files from GitHub API
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format');
      }

      const jsonFiles = data.filter(file => file.name.endsWith('.json'));
      jsonFiles.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name.replace('.json', '');
        // Attach event listener to each list item to handle clicks
        listItem.addEventListener('click', () => displayRecipe(file.name));
        recipeList.appendChild(listItem);
      });
    })
    .catch(error => {
      recipeList.innerHTML = `<p>Error loading recipes: ${error.message}</p>`;
    });

function displayRecipe(recipeData) {
  // Populate ingredients and steps lists
  const ingredientsHTML = generateIngredientHTML(recipeData.ingredients, 1);
  const stepsHTML = recipeData.steps.map(step => `<li>${step}</li>`).join('');

  document.getElementById('ingredientList').innerHTML = ingredientsHTML;
  document.getElementById('stepsList').innerHTML = stepsHTML;

  // Handle ingredient checkbox interaction
  updateIngredientCheckboxListeners();
}

  // Function to generate ingredient HTML with scaling
  function generateIngredientHTML(ingredients, scaleFactor) {
    return ingredients.map((item, index) =>
      `<li>
        <input type="checkbox" id="ingredient-${index}" />
        <label for="ingredient-${index}">
          ${parseFloat(item.amount * scaleFactor)} ${item.measurement} ${item.ingredient}
        </label>
      </li>`
    ).join('');
  }

  // Function to update checkbox listeners for crossing out ingredients
  function updateIngredientCheckboxListeners() {
    document.querySelectorAll('#ingredientList input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        const label = event.target.nextElementSibling;
        if (event.target.checked) {
          label.style.textDecoration = 'line-through';
        } else {
          label.style.textDecoration = 'none';
        }
      });
    });
  }

  // Back button functionality to switch back to the recipe list view
  backButton.addEventListener('click', () => {
    recipeListSection.style.display = 'block';
    recipeDetailsSection.style.display = 'none';
  });
});


