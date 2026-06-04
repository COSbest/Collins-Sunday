// ===============================
// HAMBURGER MENU
// ===============================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
        nav.classList.toggle('open');
    });
}

// ===============================
// RECIPES DATA
// ===============================
let recipes = [
    {
        id: 1,
        name: 'Jollof Rice',
        category: 'dinner',
        cuisine: 'Nigerian',
        emoji: '🍚',
        ingredients: [
            '2 cups rice',
            'Tomato paste',
            'Onions',
            'Seasoning',
            'Chicken stock'
        ],
        instructions: 'Fry tomato base, add stock, cook rice in sauce.',
        isFavorite: false
    },

    {
        id: 2,
        name: 'Avocado Toast',
        category: 'breakfast',
        cuisine: 'International',
        emoji: '🥑',
        ingredients: [
            '2 slices bread',
            '1 ripe avocado',
            'Salt',
            'Pepper',
            'Lemon'
        ],
        instructions: 'Toast bread. Mash avocado with lemon and salt. Spread.',
        isFavorite: false
    },

    {
        id: 3,
        name: 'Chicken Pasta',
        category: 'dinner',
        cuisine: 'Italian',
        emoji: '🍝',
        ingredients: [
            '200g pasta',
            'Chicken breast',
            'Cream',
            'Garlic',
            'Parmesan'
        ],
        instructions: 'Cook pasta. Fry garlic and chicken, add cream, toss.',
        isFavorite: true
    },

    {
        id: 4,
        name: 'Mango Smoothie',
        category: 'snack',
        cuisine: 'Tropical',
        emoji: '🥭',
        ingredients: [
            '2 mangoes',
            '1 cup milk',
            'Honey',
            'Ice cubes'
        ],
        instructions: 'Blend all until smooth.',
        isFavorite: false
    }
];

// ===============================
// ELEMENTS
// ===============================
const recipeGrid = document.getElementById('recipeGrid');
const modalOverlay = document.getElementById('modalOverlay');
const openFormBtn = document.getElementById('openFormBtn');
const modalClose = document.getElementById('modalClose');
const saveRecipeBtn = document.getElementById('saveRecipeBtn');

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

const shoppingPanel = document.getElementById('shoppingPanel');
const shoppingItems = document.getElementById('shoppingItems');
const closeShoppingPanel = document.getElementById('closeShoppingPanel');

// ===============================
// RENDER RECIPES
// ===============================
function renderRecipes(list) {

    if (!recipeGrid) return;

    if (list.length === 0) {

        recipeGrid.innerHTML = `
            <div class="empty-state">
                <div class="icon">🍽</div>
                <p>No recipes found. Try adding one!</p>
            </div>
        `;

        return;
    }

    let html = '';

    list.forEach(recipe => {

        const preview = recipe.ingredients
            .slice(0, 3)
            .map(ingredient => `
                <span style="font-size:0.8rem;color:#6B7280">
                    • ${ingredient}
                </span>
            `)
            .join('<br>');

        const heart = recipe.isFavorite ? '❤' : '🤍';

        const favClass = recipe.isFavorite
            ? 'btn-icon btn-favorite active'
            : 'btn-icon btn-favorite';

        html += `
            <div class="card">

                <div class="card-header">
                    ${recipe.emoji || '🍽'}
                </div>

                <div class="card-body">

                    <h3 class="card-title">
                        ${recipe.name}
                    </h3>

                    <span class="card-badge">
                        ${recipe.category}
                    </span>

                    <p class="card-cuisine">
                        Cuisine: ${recipe.cuisine}
                    </p>

                    <div style="margin-top:8px">
                        ${preview}
                    </div>

                </div>

                <div class="card-actions">

                    <button
                        class="btn-icon btn-delete"
                        data-id="${recipe.id}">
                        🗑 Delete
                    </button>

                    <button
                        class="btn-icon btn-shopping"
                        data-id="${recipe.id}">
                        🛒 Shop
                    </button>

                    <button
                        class="${favClass}"
                        data-id="${recipe.id}">
                        ${heart} Fav
                    </button>

                </div>

            </div>
        `;
    });

    recipeGrid.innerHTML = html;

    attachCardEvents();
}

// ===============================
// CARD EVENTS
// ===============================
function attachCardEvents() {

    // DELETE
    document.querySelectorAll('.btn-delete').forEach(btn => {

        btn.addEventListener('click', function () {

            const id = Number(this.dataset.id);

            const confirmDelete = confirm('Delete this recipe?');

            if (!confirmDelete) return;

            recipes = recipes.filter(recipe => recipe.id !== id);

            saveToStorage();

            renderRecipes(recipes);
        });
    });

    // FAVORITE
    document.querySelectorAll('.btn-favorite').forEach(btn => {

        btn.addEventListener('click', function () {

            const id = Number(this.dataset.id);

            toggleFavorite(id);
        });
    });

    // SHOPPING
    document.querySelectorAll('.btn-shopping').forEach(btn => {

        btn.addEventListener('click', function () {

            const id = Number(this.dataset.id);

            openShoppingList(id);
        });
    });
}

// ===============================
// FAVORITE TOGGLE
// ===============================
function toggleFavorite(id) {

    const recipe = recipes.find(recipe => recipe.id === id);

    if (!recipe) return;

    recipe.isFavorite = !recipe.isFavorite;

    saveToStorage();

    renderRecipes(recipes);
}

// ===============================
// LOCAL STORAGE
// ===============================
function saveToStorage() {

    localStorage.setItem(
        'recipebookData',
        JSON.stringify(recipes)
    );
}

function loadFromStorage() {

    const storedRecipes = localStorage.getItem('recipebookData');

    if (storedRecipes) {

        recipes = JSON.parse(storedRecipes);
    }
}

// ===============================
// INITIALIZE APP
// ===============================
function init() {

    loadFromStorage();

    renderRecipes(recipes);
}

init();

// ===============================
// MODAL
// ===============================
if (openFormBtn && modalOverlay) {

    openFormBtn.addEventListener('click', () => {

        modalOverlay.classList.add('open');
    });
}

if (modalClose && modalOverlay) {

    modalClose.addEventListener('click', () => {

        modalOverlay.classList.remove('open');
    });
}

if (modalOverlay) {

    modalOverlay.addEventListener('click', event => {

        if (event.target === modalOverlay) {

            modalOverlay.classList.remove('open');
        }
    });
}

// ===============================
// SAVE RECIPE
// ===============================
if (saveRecipeBtn) {

    saveRecipeBtn.addEventListener('click', function () {

        const name =
            document.getElementById('recipeName').value.trim();

        const category =
            document.getElementById('recipeCategory').value;

        const cuisine =
            document.getElementById('recipeCuisine').value.trim();

        const emoji =
            document.getElementById('recipeEmoji').value.trim() || '🍽';

        const instructions =
            document.getElementById('recipeInstructions').value.trim();

        const ingredients =
            document.getElementById('recipeIngredients')
                .value
                .split('\n')
                .map(item => item.trim())
                .filter(Boolean);

        if (!name || ingredients.length === 0) {

            alert('Please enter a recipe name and ingredients.');

            return;
        }

        const newRecipe = {
            id: Date.now(),
            name,
            category,
            cuisine: cuisine || 'Not specified',
            emoji,
            ingredients,
            instructions,
            isFavorite: false
        };

        recipes.push(newRecipe);

        saveToStorage();

        renderRecipes(recipes);

        modalOverlay.classList.remove('open');

        clearForm();
    });
}

// ===============================
// CLEAR FORM
// ===============================
function clearForm() {

    document.getElementById('recipeName').value = '';
    document.getElementById('recipeCuisine').value = '';
    document.getElementById('recipeIngredients').value = '';
    document.getElementById('recipeInstructions').value = '';
    document.getElementById('recipeEmoji').value = '';
}

// ===============================
// SEARCH & FILTER
// ===============================
function applyFilters() {

    const searchValue =
        searchInput.value.toLowerCase().trim();

    const categoryValue =
        categoryFilter.value;

    const filteredRecipes = recipes.filter(recipe => {

        const matchesSearch =
            recipe.name.toLowerCase().includes(searchValue) ||
            recipe.cuisine.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryValue === 'all' ||
            recipe.category === categoryValue;

        return matchesSearch && matchesCategory;
    });

    renderRecipes(filteredRecipes);
}

if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
}

// ===============================
// SHOPPING LIST
// ===============================
if (closeShoppingPanel) {

    closeShoppingPanel.addEventListener('click', () => {

        shoppingPanel.classList.remove('open');
    });
}

function openShoppingList(id) {

    const recipe = recipes.find(recipe => recipe.id === id);

    if (!recipe) return;

    const itemsHTML = recipe.ingredients
        .map(item => `
            <div class="shopping-item">
                🛒 ${item}
            </div>
        `)
        .join('');

    shoppingItems.innerHTML = `
        <p style="font-weight:600;color:#40916C;margin-bottom:16px">
            ${recipe.emoji} ${recipe.name}
        </p>

        ${itemsHTML}

        <p style="margin-top:16px;color:#6B7280;font-size:0.85rem">
            ${recipe.ingredients.length} items total
        </p>
    `;

    shoppingPanel.classList.add('open');
}