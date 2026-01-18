"use strict";

/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
let dom = {
  search_filters_section: document.getElementById("search-filters-section"),
  nav_link: document.querySelectorAll(".nav-link"),
  meal_categories_section: document.getElementById("meal-categories-section"),
  section: document.querySelectorAll("section"),
  search_filters_section: document.querySelector("#search-filters-section "),
  all_recipes_section: document.querySelector("#all-recipes-section"),
  countryBUtton: document.querySelector(".countryBUtton"),
  btn: document.querySelectorAll(".btn"),
  categories_grid: document.getElementById("categories-grid"),
  recipes_count: document.getElementById("recipes-count"),
  recipe_card: document.getElementById("recipe-card"),
  recipes_grid: document.getElementById("recipes-grid"),
  category_card: document.querySelectorAll(".category-card"),
  search_input: document.getElementById("search-input"),
  header_menu_btn: document.getElementById("header-menu-btn"),
  sidebar: document.getElementById("sidebar"),
  header_h1: document.querySelector(".header_h1"),
  foodlog_date: document.getElementById("foodlog-date"),
  header_p: document.querySelector(".header_P"),
  search_product_btn: document.getElementById("search-product-btn"),
  meal_details: document.getElementById("meal-details"),
  back_to_meals_btn: document.getElementById("back-to-meals-btn"),
  sidebar_close_btn: document.getElementById("sidebar-close-btn"),
  lookup_barcode_btn: document.getElementById("lookup-barcode-btn"),
  barcode_input: document.getElementById("barcode-input"),
  product_categories: document.getElementById("product-categories"),
};

// handel side bar
dom.header_menu_btn.addEventListener("click", () => {
  dom.sidebar.style.transform = "translate(0)";
});
dom.sidebar_close_btn.addEventListener("click", () => {
  dom.sidebar.style.transform = "translate(-100%)";
  location.reload();
});

//navs&&tabs
dom.nav_link.forEach((nav) => {
  nav.addEventListener("click", () => {
    dom.nav_link.forEach((n) => {
      n.classList.remove("bg-emerald-50", "text-emerald-700");
      n.classList.add("text-gray-600", "hover:bg-gray-50");
    });
    nav.classList.add("bg-emerald-50", "text-emerald-700");
    let target = nav.dataset.category;

    dom.section.forEach((section) => section.classList.add("hidden"));
    document
      .querySelectorAll(`#${target}`)
      .forEach((t) => t.classList.remove("hidden"));
    if (target === "meal-categories-section") {
      dom.search_filters_section.classList.remove("hidden");
      dom.all_recipes_section.classList.remove("hidden");
    } else {
      dom.search_filters_section.classList.add("hidden");
      dom.all_recipes_section.classList.add("hidden");
    }
  });
});
//wait for load html to request data from api
document.addEventListener("DOMContentLoaded", () => {
  allCountry();
  MealType();
  SearchbyproductCategory();
  displayRecipes(
    "https://nutriplan-api.vercel.app/api/meals/search?q=chicken&page=1&limit=25",
  );
});
document.addEventListener("load", () => {
  allCountry();
  MealType();

  displayRecipes(
    "https://nutriplan-api.vercel.app/api/meals/search?q=chicken&page=1&limit=25",
  );
});
//dynamic fetch function
async function fetchData(apiLink) {
  try {
    let data = await fetch(`${apiLink}`);
    if (!data.ok) {
      throw new Error(`http error ${data.status}`);
    } else {
      let response = await data.json();
      return response;
    }
  } catch (error) {
    console.log(error.message);
  }
}
//display meals country
async function allCountry() {
  let allData = await fetchData(
    "https://nutriplan-api.vercel.app/api/meals/areas",
  );

  let buttons = `<button
                data-area="all"
              class="px-4 py-2 bg-gray-100 area text-gray-700 btn active rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all"
            >
              All Recipes
            </button>
     `;
  for (let i = 0; i < 8; i++) {
    buttons += `
           
    
    <button
    data-area="${allData.results[i].name}"
              class="px-4 area btn py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
            >
              ${allData.results[i].name}
            </button>`;
  }
  dom.countryBUtton.innerHTML = buttons;
  const button = document.querySelectorAll(".btn");
  button.forEach((btn) => {
    btn.addEventListener("click", () => {
      button.forEach((bt) => {
        bt.classList.remove("active");
        // bt.classList.add("bg-gray-100", "text-gray-700");
      });
      btn.classList.add("active");
      console.log("hi");
    });
  });
}

dom.countryBUtton.addEventListener("click", (e) => {
  const area = e.target.closest(".area");
  if (!area) return;
  const target = area.dataset.area;
  if (target === "all") {
    displayRecipes(
      "https://nutriplan-api.vercel.app/api/meals/search?q=chicken&page=1&limit=25",
    );
  } else {
    displayRecipes(
      `https://nutriplan-api.vercel.app/api/meals/filter?area=${target}&page=1&limit=25`,
    );
  }
});

//display meal type
async function MealType() {
  let mealType = await fetchData(
    `https://nutriplan-api.vercel.app/api/meals/categories`,
  );
  let response = await mealType.results;
  let mealTypebox = "";
  for (let i = 0; i < response.length; i++) {
    mealTypebox += ` <div
              class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
              data-category="${response[i].name}"
              data-index="${i}"
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                  <img class="w-full object-cover" src="${response[i].thumbnail}"/>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${response[i].name}</h3>
                </div>
              </div>
            </div>`;
  }
  dom.categories_grid.innerHTML = mealTypebox;
}
// display meals by category

dom.categories_grid.addEventListener("click", (e) => {
  const card = e.target.closest(".category-card");
  if (!card) return;
  const target = card.dataset.category;

  displayRecipes(
    `https://nutriplan-api.vercel.app/api/meals/filter?category=${target}&page=1&limit=25`,
  );
});
let allmeal = [];
async function displayRecipes(apiLink) {
  let array = [];
  if (!Array.isArray(apiLink)) {
    let data = await fetchData(`${apiLink}`, {
      headers: {
        "x-api-key": "MwkKs0xkGfQzZp1OALiDwEAAqM8NbcQ3hiNmkvmb",
      },
    });
    array = data.results;
    allmeal = array;
  } else {
    array = apiLink;
  }
  let RecipesBox = "";

  for (let i = 0; i < array.length; i++) {
    RecipesBox += ` <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${array[i].id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${array[i].thumbnail}"
                  alt="${array[i].name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                 ${array[i].category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${array[i].area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${array[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                 ${array[i].instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                   ${array[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${array[i].area}
                  </span>
                </div>
              </div>
            </div>`;
  }

  const count = ` Showing ${array.length} recipes`;
  dom.recipes_count.innerHTML = count;
  dom.recipes_grid.innerHTML = RecipesBox;
}
async function AdvancedSearch(value) {
  let data = await fetchData(
    "https://nutriplan-api.vercel.app/api/meals/random?count=30",
  );
  if (!data || !data.results) {
    console.log("no data found");
    return [];
  }
  let response = data.results;
  const userdata = value.trim().toLowerCase();
  let newarr = [];
  for (let i = 0; i < response.length; i++) {
    if (
      response[i].name.toLowerCase().includes(userdata) ||
      response[i].category.toLowerCase().includes(userdata) ||
      response[i].area.toLowerCase().includes(userdata)
    ) {
      newarr.push(response[i]);
    }
  }
  console.log(newarr);

  return displayRecipes(newarr);
}

dom.search_input.addEventListener("input", (e) => {
  let value = e.target.value;
  if (!value.trim()) {
    return displayRecipes(
      "https://nutriplan-api.vercel.app/api/meals/random?count=30",
    );
  }
  console.log("hi");

  AdvancedSearch(value);
});
dom.recipes_grid.addEventListener("click", async (e) => {
  let card = e.target.closest(".recipe-card");
  if (!card) return;
  let id = card.dataset.mealId;
  dom.meal_details.classList.remove("hidden");
  dom.all_recipes_section.classList.add("hidden");
  dom.meal_categories_section.classList.add("hidden");
  dom.search_filters_section.classList.add("hidden");
  dom.header_h1.innerHTML = "Recipe Details";
  dom.header_p.innerHTML = "View full recipe information and nutrition facts";
  ShowMealDetails(id);
});

dom.meal_details.addEventListener("click", (e) => {
  let btn = e.target.closest("#back-to-meals-btn");
  if (!btn) return;

  dom.meal_details.classList.add("hidden");

  dom.all_recipes_section.classList.remove("hidden");
  dom.meal_categories_section.classList.remove("hidden");
  dom.search_filters_section.classList.remove("hidden");
});
let datalogged = {};
//display meal details
async function ShowMealDetails(id) {
  let meal = [];
  for (let i = 0; i < allmeal.length; i++) {
    if (allmeal[i].id === id) {
      meal.push(allmeal[i]);
    }
  }
  console.log(meal);

  const mealData = await fetchmealproperty(meal);
  datalogged = [
    {
      mealData: await mealData,
      meal: meal[0],
    },
  ];
  let meal_properties = `<div class="max-w-7xl mx-auto">
          <!-- Back Button -->
          <button
            id="back-to-meals-btn"
            class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Recipes</span>
          </button>

          <!-- Hero Section -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="relative h-80 md:h-96">
              <img
                src="${meal[0].thumbnail}"
                alt="${meal[0].name}"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    >${meal[0].category}</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    >${meal[0].area}</span
                  >
                  <span
                    class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                    >Casserole</span
                  >
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${meal[0].name}
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">4 servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">${await mealData.data.perServing.calories} cal/serving</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mb-8">
            <button
              id="log-meal-btn"
              class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              data-meal-id="${meal[0].id}"
            >
              <i class="fa-solid fa-clipboard-list"></i>
              <span>Log This Meal</span>
            </button>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Ingredients & Instructions -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Ingredients -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto"
                    >${meal[0].ingredients.length} items</span
                  >
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${returningredients(meal[0].ingredients)}
                </div>
              </div>

              <!-- Instructions -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                  ${returninstructions(meal[0].instructions)}
                </div>
              </div>

              <!-- Video Section -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div
                  class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  <iframe
                    src=""
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>
                </div>
              </div>
            </div>

            <!-- Right Column - Nutrition -->
            <div class="space-y-6">
              <!-- Nutrition Facts -->
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  <p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div
                    class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                  >
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">${await mealData
                      .data.perServing.calories}</p>
                    <p class="text-xs text-gray-500 mt-1">Total: ${await mealData.data.totals.calories} cal</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span class="font-bold text-gray-900">${await mealData.data.perServing.protein}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-emerald-500 h-2 rounded-full"
                        style="width: 84%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span class="font-bold text-gray-900">${await mealData.data.perServing.carbs}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: 17%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${await mealData.data.perServing.fat}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width: 12%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span class="font-bold text-gray-900">${await mealData.data.perServing.fiber}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full"
                        style="width: 14%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span class="font-bold text-gray-900">${await mealData.data.perServing.sugar}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        style="width: 24%"
                      ></div>
                    </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">
                      Vitamins & Minerals (% Daily Value)
                    </h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Vitamin A</span>
                        <span class="font-medium">15%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Vitamin C</span>
                        <span class="font-medium">25%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Calcium</span>
                        <span class="font-medium">4%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Iron</span>
                        <span class="font-medium">12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  dom.meal_details.innerHTML = meal_properties;
}
function returningredients(arr) {
  let box = ``;
  for (let i = 0; i < arr.length; i++) {
    box += `  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">${arr[i].measure}</span> ${arr[i].ingredient}
                    </span>
                  </div>
`;
  }
  return box;
}
function returninstructions(arr) {
  let box = ``;
  for (let i = 0; i < arr.length; i++) {
    box += ` <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      ${i + 1}
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      ${arr[i]}
                    </p>
                  </div>`;
  }
  return box;
}
//recipe details fetch
async function fetchmealproperty(meal) {
  try {
    const ingredientData = meal[0].ingredients.map((m) => {
      return `${m.measure} ${m.ingredient}`;
    });
    let data = await fetch(
      `https://nutriplan-api.vercel.app/api/nutrition/analyze`,
      {
        method: "post",
        headers: {
          "x-api-key": "MwkKs0xkGfQzZp1OALiDwEAAqM8NbcQ3hiNmkvmb",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeName: meal[0].name,
          ingredients: ingredientData,
        }),
      },
    );
    if (!data.ok) {
      throw new Error("check your connection");
    } else {
      return await data.json();
    }
  } catch (error) {
    console.log(error.message);
  }
}
//load sweet alert

// or via CommonJS
//log-meal-btn
dom.meal_details.addEventListener("click", (e) => {
  let btn = e.target.closest("#log-meal-btn");
  if (!btn) return;
  Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success");
      const time = new Date();
      const date = time.toLocaleString();
      console.log(date);
      datalogged.date = date;
      localStorage.setItem("logged_meal", JSON.stringify(datalogged));
      console.log(datalogged);
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
});
let today = new Date();

let weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let weekday = weekdays[today.getDay()];
let month = months[today.getMonth()];
let date = today.getDate();
let formattedDate = `${weekday}, ${month} ${date}`;
console.log(formattedDate);

dom.foodlog_date.innerHTML = `${formattedDate}`;

function loggedItem() {
  let newArray = [];
  let data = JSON.parse(localStorage.getItem("logged_meal"));
  console.log(data);
  newArray.push(data);

  const logged_items_list = document.getElementById("logged-items-list");
}
loggedItem();
async function displayproductscanner(value) {
  let data;
  let result;
  if (returntypeofinput(value) == "number") {
    data = await fetchData(
      `https://nutriplan-api.vercel.app/api/products/barcode/${value}`,
    );
    result = data.result ? [data.result] : [];
  } else if (returntypeofinput(value) == "string") {
    data = await fetchData(
      `https://nutriplan-api.vercel.app/api/products/search?q=${value}&page=1&limit=24`,
    );
    result = data.results ?? [];
  } else {
    return;
  }

  let box = ``;
  for (let i = 0; i < result.length; i++) {
    box += ` <div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${result[i].barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${result[i].image}"
                    alt="${result[i].name}"
                    loading="lazy"
                  />

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                   ${result[i].brand}
                  </div>

                  <!-- NOVA Badge -->
                  <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA 2"
                  >
                    ${result[i].novaGroup}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                   ${result[i].brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${result[i].name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>250g</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>${
                        result[i].nutrients.calories
                      } kcal/100g</span
                    >
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${
                        result[i].nutrients.protein
                      }</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${
                        result[i].nutrients.carbs
                      }</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${
                        result[i].nutrients.fat
                      }g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${
                        result[i].nutrients.sugar
                      }.5g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>`;
  }
  const products_grid = document.getElementById("products-grid");
  products_grid.innerHTML = box;
}
dom.search_product_btn.addEventListener("click", () => {
  const product_search_input = document
    .getElementById("product-search-input")
    .value.trim()
    .toLowerCase();
  if (product_search_input == "") {
    return "please input your value";
  }

  console.log(returntypeofinput(product_search_input));

  return displayproductscanner(product_search_input);
});
//cheack type of value input function
function returntypeofinput(value) {
  if (value.trim() == "") {
    return "empty";
  } else if (!isNaN(value)) {
    return "number";
  } else {
    return "string";
  }
}
dom.lookup_barcode_btn.addEventListener("click", () => {
  console.log("hi");

  displayproductscanner(dom.barcode_input.value);
});
async function SearchbyproductCategory() {
  let data = await fetchData(
    `https://nutriplan-api.vercel.app/api/products/categories`,
  );
  let response = data.results;
  let box = ``;
  for (let i = 0; i < 8; i++) {
    box += `   <button
                  data-category=${response[i].name}
                class="product-category-btn px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-emerald-200 transition-all"
              >
                <i class="fa-solid fa-cookie mr-1.5"></i>${response[i].name}
              </button>`;
  }
  return (dom.product_categories.innerHTML = box);
}
dom.product_categories.addEventListener("click", async (e) => {
  let target = e.target.closest(".product-category-btn");
  if (!target) {
    return;
  } else {
    let choosen = target.dataset.category;
    return displayproductscanner(choosen);
  }
});
