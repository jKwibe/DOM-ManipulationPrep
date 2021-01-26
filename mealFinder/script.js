// https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata

const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear Single meal
    single_mealEl.innerHTML = '';

    // Get the search term
    const term = search.value.trim();

    // Check for empty
    if(term){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML =  `<h2> Search Results for "${term}"</h2>`;
                if(data.meals === null){
                    resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`
                }else{
                    mealsEl.innerHTML = data.meals.map( meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                        </div>
                    
                    </div>
                   `).join('');
                }
            });
        // clear search text
        search.value = '';
    }else{
        alert('Please Enter a search term')
    }
}

async function getRandomMeal() {
    //clear meals and headings
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    const res = await  fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    const meal = data.meals[0];

    addMealToDOM(meal)
}

function addMealToDOM(meal) {
    const ingredients = [];
    for(let i =1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }else{
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>`: ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>`: ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
            ${ingredients.map(ingredient => `<li>${ingredient}</li>` ).join('')}
            </ul>
        </div>
    </div>
    `
}

async function getMealByID(mealID){
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    const meal = data.meals[0]
    addMealToDOM(meal)
}
// event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.composedPath().find(item => {
        if (item.classList){
            return item.classList.contains('meal-info');
        }else{
            return false;
        }
    });
    if(mealInfo){
       const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID);
    };
});

