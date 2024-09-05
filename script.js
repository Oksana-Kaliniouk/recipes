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
      console.log('GitHub API response:', data);  // Log the response for debugging
      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format');
      }

      const jsonFiles = data.filter(file => file.name.endsWith('.json'));
      jsonFiles.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name.replace('.json', '');
        listItem.addEventListener('click', () => displayRecipe(file.name));
        recipeList.appendChild(listItem);
      });
    })
    .catch(error => {
      recipeList.innerHTML = `<p>Error loading recipes: ${error.message}</p>`;
    });

  // Function to display recipe and switch view
  function displayRecipe(filename) {
    fetch(`./recipes/${filename}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching recipe: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        recipeDisplay.innerHTML = `
          <h2>${data.title}</h2>
          <label for="scaleInput">Scale Recipe: </label>
          <input type="number" id="scaleInput" value="1" min="1" step="1" />
          <h3>Ingredients:</h3>
          <ul id="ingredientList">${generateIngredientHTML(data.ingredients, 1)}</ul>
          <h3>Steps:</h3>
          <ol>${data.steps.map(step => `<li>${step}</li>`).join('')}</ol>
        `;

        const scaleInput = document.getElementById('scaleInput');
        scaleInput.addEventListener('input', (event) => {
          const scaleFactor = parseFloat(event.target.value) || 1;
          document.getElementById('ingredientList').innerHTML = generateIngredientHTML(data.ingredients, scaleFactor);
        });

        // Add checkbox functionality for crossing off ingredients
        updateIngredientCheckboxListeners();

        // Hide the recipe list and show the recipe details
        recipeListSection.style.display = 'none';
        recipeDetailsSection.style.display = 'block';
      })
      .catch(error => {
        recipeDisplay.innerHTML = `<p>Failed to load recipe: ${error.message}</p>`;
      });
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
