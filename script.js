document.addEventListener("DOMContentLoaded", () => {
  const recipeList = document.getElementById('recipeList');
  const recipeDisplay = document.getElementById('recipeDisplay');

  const repoOwner = 'Oksana-Kaliniouk';  // Replace with your GitHub username
  const repoName = 'recipes';  // Replace with your GitHub repository name
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/recipes`;

  // Fetch list of files from GitHub API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const jsonFiles = data.filter(file => file.name.endsWith('.json'));
      jsonFiles.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name.replace('.json', '');
        listItem.addEventListener('click', () => displayRecipe(file.name));
        recipeList.appendChild(listItem);
      });
    })
    .catch(error => {
      recipeList.innerHTML = `<p>Error loading recipes: ${error}</p>`;
    });

  // Fetch and display recipe
  function displayRecipe(filename) {
    fetch(`./recipes/${filename}`)
      .then(response => response.json())
      .then(data => {
        const ingredientsHTML = data.ingredients.map(item =>
          `<li>${item.amount} ${item.measure
