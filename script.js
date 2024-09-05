document.addEventListener("DOMContentLoaded", () => {
  const recipeList = document.getElementById('recipeList');
  const recipeDisplay = document.getElementById('recipeDisplay');

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

  // Function to display recipe
  function displayRecipe(filename) {
    fetch(`./recipes/${filename}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching recipe: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Create input field for scaling the ingredients
        const scaleInputHTML = `
          <label for="scaleInput">Scale Recipe: </label>
          <input type="number" id="scaleInput" value="1" min="1" step="1" />
        `;

        recipeDisplay.innerHTML = `
          <h2>${data.title}</h2>
          ${scaleInputHTML}
          <h3>Ingredients:</h3>
          <ul id="ingredientList">${generateIngredientHTML(data.ingredients, 1)}</ul>
          <h3>Steps:</h3>
          <ol>${data.steps.map(step => `<li>${step}</li>`).join('')}</ol>
        `;

        // Add event listener to the scale input field
        const scaleInput = document.getElementById('scaleInput');
        scaleInput.addEventListener('input', (event) => {
          const scaleFactor = parseFloat(event.target.value) || 1;
          document.getElementById('ingredientList').innerHTML = generateIngredientHTML(data.ingredients, scaleFactor);
          
          // Reapply checkbox listeners
          updateIngredientCheckboxListeners();
        });
      })
      .catch(error => {
        recipeDisplay.innerHTML = `<p>Failed to load recipe: ${error.message}</p>`;
      });
  }

function generateIngredientHTML(ingredients, scaleFactor) {
  return ingredients.map((item, index) =>
    `<li>
      <input type="checkbox" id="ingredient-${index}" />
      <label for="ingredient-${index}">
        ${formatAmount(item.amount * scaleFactor)} ${item.measurement} ${item.ingredient}
      </label>
    </li>`
  ).join('');
}
  function formatAmount(amount) {
  return amount % 1 === 0 ? amount : amount.toFixed(2).replace(/\.00$/, ''); // Remove trailing ".00" if it's a whole number
}

  // Function to update checkboxes for crossing out ingredients
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
});
