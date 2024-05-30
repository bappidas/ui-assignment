// Preloader JS Starts
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
    setTimeout(function() {
        document.getElementById('status').style.transition = 'opacity 0.6s';
        document.getElementById('status').style.opacity = 0;        
        setTimeout(function() {
            document.getElementById('status').style.display = 'none';
        }, 600); 

        document.getElementById('preloader').style.transition = 'opacity 0.6s';
        document.getElementById('preloader').style.opacity = 0;
        setTimeout(function() {
            document.getElementById('preloader').style.display = 'none';
        }, 600); 

        document.getElementById('loading-text').style.transition = 'opacity 0.6s';
        document.getElementById('loading-text').style.opacity = 0;
        setTimeout(function() {
            document.getElementById('loading-text').style.display = 'none';
        }, 600);

        document.body.classList.remove('preload');
    }, 1000); // Delay before starting fadeOut
});
// Preloader JS Ends

// Mobile Menu Toggling JS Starts
const navbarMenu = document.getElementById("menu");
const burgerMenu = document.getElementById("burger");

burgerMenu.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
  burgerMenu.classList.toggle("is-active");
});

// Skeleton Loader JS
function showSkeletonLoaders(containerId, numLoaders = 6) {
    const container = document.getElementById(containerId);
    let skeletonHTML = '';

    for (let i = 0; i < numLoaders; i++) {
        skeletonHTML += `
            <div class="product_card">
                <div class="skeleton_image"></div>
                <div class="product_info_skeleton">
                    <div class="skeleton_text skeleton_name"></div>
                    <div class="skeleton_text skeleton_price"></div>
                    <div class="skeleton_heart"></div>
                </div>
            </div>
        `;
    }

    container.innerHTML = skeletonHTML;
}

// Call for skeleton loaders
//showSkeletonLoaders('page1');




// API Call to load Products
const apiUrl = 'https://fakestoreapi.com/products';
let currentPage = 1;
const itemsPerPage = 6;
let allProducts = [];

let totalProductsLoaded = 6;
const resultTextElement = document.getElementById('resultText');
resultTextElement.textContent = `${totalProductsLoaded} Results`;

fetchProducts();

function fetchProducts() {
    showSkeletonLoaders('page1', itemsPerPage);

    setTimeout(() => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                allProducts = data;
                displayProducts('page1', currentPage);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, 2000);
}


function displayProducts(containerId, page, products = allProducts) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const productsToDisplay = products.slice(startIndex, endIndex);

    const container = document.getElementById(containerId);
    container.innerHTML = ''; 

    productsToDisplay.forEach(product => {
        const productCard = `
            <div class="product_card">
                <img src="${product.image}" alt="product-image" class="product_image">
                <div class="product_info">
                    <div class="product_name">${product.title}</div>
                    <div class="product_price">$<span>${product.price}</span></div>
                    <div class="heart_wrapper">
                        <span class="unfilled">🤍</span>
                        <span class="filled">❤️</span>
                        <span class="rating">Rating: ${product.rating.rate}</span>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productCard);
    });

    updateHeartToggleListeners();

    if (endIndex >= products.length) {
        document.querySelector('.load_more_cta_wrapper').style.display = 'none';
    } else {
        document.querySelector('.load_more_cta_wrapper').style.display = 'grid';
    }
}


function displayFilteredProducts(containerId, products) {
    const startIndex = 0;
    const endIndex = products?.length;
    const productsToDisplay = products.slice(startIndex, endIndex);

    const container = document.getElementById(containerId);
    container.innerHTML = ''; 

    productsToDisplay.forEach(product => {
        const productCard = `
            <div class="product_card">
                <img src="${product.image}" alt="product-image" class="product_image">
                <div class="product_info">
                    <div class="product_name">${product.title}</div>
                    <div class="product_price">$<span>${product.price}</span></div>
                    <div class="heart_wrapper">
                        <span class="unfilled">🤍</span>
                        <span class="filled">❤️</span>
                        <span class="rating">Rating: ${product.rating.rate}</span>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productCard);
    });

    updateHeartToggleListeners();
    document.querySelector('.load_more_cta_wrapper').style.display = 'none';
}


// Heart Toggle JS
function updateHeartToggleListeners() {
    const heartWrappers = document.querySelectorAll('.heart_wrapper');

    heartWrappers.forEach(wrapper => {
        const unfilledHeart = wrapper.querySelector('.unfilled');
        const filledHeart = wrapper.querySelector('.filled');

        unfilledHeart.addEventListener('click', function () {
            unfilledHeart.style.display = 'none';
            filledHeart.style.display = 'inline';
        });

        filledHeart.addEventListener('click', function () {
            filledHeart.style.display = 'none';
            unfilledHeart.style.display = 'inline';
        });
    });
}
// Heart Toggle JS Ends

document.getElementById('loadMore').addEventListener('click', () => {
    currentPage++;
    
    const newDivId = `page${currentPage}`;

    const newDiv = document.createElement('div');
    newDiv.className = 'products_wrapper';
    newDiv.id = newDivId;

    const loadMoreCtaWrapper = document.getElementsByClassName('load_more_cta_wrapper')[0];
    loadMoreCtaWrapper.parentNode.insertBefore(newDiv, loadMoreCtaWrapper);

    showSkeletonLoaders(newDivId, 3);
    setTimeout(() => {
        displayProducts(newDivId, currentPage);
        const newProductsLoaded = document.querySelectorAll(`#page${currentPage} .product_card`).length;
        totalProductsLoaded = totalProductsLoaded + newProductsLoaded;
        resultTextElement.textContent = `${totalProductsLoaded} Results`;
    }, 3000);
});


// Sorting Functionality
let IS_FILTERED_PRODUCT_DISPLAY_ON = 0;
let FILTERED_PRODUCTS = [];

function displaySortedProductsOnAllPages(sortValue) {
    const pageIds = Array.from(document.querySelectorAll('.products_wrapper')).map(page => page.id).filter(item => !item.startsWith('filteredProduct'));
    
    console.log(pageIds);
    pageIds.forEach((pageId, index) => {
        console.log(index);
        displayProducts(pageId, index + 1);
    });
}

function sortProducts(criteria, prodArray) {
    switch (criteria) {
        case 'priceAsc':
            prodArray.sort((a, b) => a.price - b.price);
            break;
        case 'priceDes':
            prodArray.sort((a, b) => b.price - a.price);
            break;
        case 'ratingAsc':
            prodArray.sort((a, b) => a.rating.rate - b.rating.rate);
            break;
        case 'ratingDsc':
            prodArray.sort((a, b) => b.rating.rate - a.rating.rate);
            break;
    }
}

const sortDropdown = document.querySelector('.sort_dropdown_wrapper select');
sortDropdown.addEventListener('change', (event) => {
    const sortValue = event.target.value;
    
    if (sortValue) { 
        
        if(IS_FILTERED_PRODUCT_DISPLAY_ON){
            sortProducts(sortValue, FILTERED_PRODUCTS);
            displayFilteredProducts('filteredProducts', FILTERED_PRODUCTS);
        }
        else{
            sortProducts(sortValue, allProducts);
            displaySortedProductsOnAllPages(sortValue);
        }
    }
    
});



// Function to filter products based on selected categories
function filterProductsByCategory() {

    const checkboxes = document.querySelectorAll('.multi_select_options input[type="checkbox"]');
    const selectedCategories = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
    console.log(selectedCategories);
    IS_FILTERED_PRODUCT_DISPLAY_ON = selectedCategories.length;

    if(selectedCategories.length === 0){
        document.getElementById('filteredProducts').innerHTML = '';
        document.getElementById('filteredProducts').style.display = 'none';
        document.getElementById('fwCta').removeAttribute('style');
        document.getElementById('fwCta').style.display = 'none';
        document.getElementById('page1').style.display = 'flex';

        showSkeletonLoaders('page1', 6);
        setTimeout(() => {
            displayProducts('page1', 1);
            const resultTextElement = document.getElementById('resultText');
            resultTextElement.textContent = `${6} Results`;
        }, 2000);
    } 
    else{
        const pageIds = Array.from(document.querySelectorAll('.products_wrapper')).map(page => page.id);
        pageIds.forEach((pageId, index) => {
            if(document.querySelector(`#page${index + 1}`) !== null){
                document.querySelector(`#page${index + 1}`).innerHTML = '';
            }            
        });
        const filteredProducts = allProducts.filter(product => {
            return selectedCategories.includes(product.category.toLowerCase());
        });
        
        console.log(filteredProducts);        
        FILTERED_PRODUCTS = filteredProducts;
        
        document.getElementById('filteredProducts').style.display = 'flex';
        document.getElementById('fwCta').style.display = 'block';
        document.getElementById('page1').style.display = 'none';
        document.querySelector('.load_more_cta_wrapper').style.display = 'none'; 
        sortProducts(sortDropdown.value, filteredProducts);
        displayFilteredProducts('filteredProducts', filteredProducts);
        
        const resultTextElement = document.getElementById('resultText');
        resultTextElement.textContent = `${filteredProducts.length} Results`;
        document.getElementById('fwCta').textContent = `SEE ${filteredProducts.length} RESULTS`;
        document.getElementById('fwCta').style.textAlign = 'center';
    }
}

const checkboxes = document.querySelectorAll('.multi_select_options input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterProductsByCategory);
});

// Modal JS
function popUpOpen(id, searchText){
    if(id=='searchResultPopUp'){
      renderSearchResultData(searchText);
    }
    
    var modal = document.querySelector('.modal');
    modal.classList.add('is_visible'); 
    
    window.onclick = function(e) {
      if(e.target == modal){
        popUpCloser();      
      }
    }    
};
  
function popUpCloser(){
    var modal = document.querySelector('.modal');
    modal.classList.remove('is_visible'); 
    clearModalData();
}
  
function clearModalData(){
    document.querySelector('.modal .modal_header').innerHTML = '';
    document.querySelector('.modal .modal_container').innerHTML = '';
    document.querySelector('.modal .modal_footer').innerHTML = '';
}

function renderSearchResultData(searchText){
    var template_header = `
    <h5>Search Results</h5>
    `;
    
    var template_container =`    
        <p class="sr_text">${1} Result found for the search term - ${searchText}</p>      
             
        <div class="products_wrapper" id="searchResults">
            <div class="product_card">
                <img src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" alt="product-image" class="product_image">
                <div class="product_info">
                    <div class="product_name">Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops</div>
                    <div class="product_price">$<span>$109.95</span></div>
                </div>
            </div>
        </div>

        <p class="note_text">As API for Search was not avilable, so I have just shown a sample sreach result page with static data.</p>
        
        `;

        document.querySelector('.modal .modal_header').innerHTML = template_header;
        document.querySelector('.modal .modal_container').innerHTML = template_container;
  }

// Search Functions
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchInput = document.getElementById('searchText').value.trim();
    const errorElement = document.querySelector('.search_error');

    if (searchInput === '') {
        errorElement.classList.add('is-visible');
    } else {
        errorElement.classList.remove('is-visible');
        popUpOpen('searchResultPopUp', searchInput)
    }
});

document.getElementById('searchText').addEventListener('input', function() {
    const errorElement = document.querySelector('.search_error');
    errorElement.classList.remove('is-visible');
});

//Showing Filter Results Screen for small devices

const filterCta = document.getElementById('filteResultCta');
const filterCtaClose = document.querySelector('.filter_window_sm .fw_header .close_icon');

filterCta.addEventListener('click', function(){
    document.querySelector('.filter_window_sm').classList.add('is_visible');
});

filterCtaClose.addEventListener('click', function(){
    document.querySelector('.filter_window_sm').classList.remove('is_visible');
});

document.getElementById('fwCta').addEventListener('click', function(){
    document.querySelector('.filter_window_sm').classList.remove('is_visible');
});

// Function to clear filters
document.getElementById('clearFilter').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.multi_select_options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    IS_FILTERED_PRODUCT_DISPLAY_ON = 0;

    
    document.getElementById('filteredProducts').innerHTML = '';
    document.getElementById('filteredProducts').style.display = 'none';
    document.getElementById('fwCta').removeAttribute('style');
    document.getElementById('fwCta').style.display = 'none';
    document.getElementById('page1').style.display = 'flex';

    showSkeletonLoaders('page1', 6);
    setTimeout(() => {
        displayProducts('page1', 1);
        const resultTextElement = document.getElementById('resultText');
        resultTextElement.textContent = `${6} Results`;
    }, 2000);
});