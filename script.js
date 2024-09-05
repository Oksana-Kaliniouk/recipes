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

  // Function to display recipe and switch view
  function displayRecipe(filename) {
    fetch(`./recipes/${filename}`)
      .then(response => {
        if (!response.ok) {
          throw new Error
