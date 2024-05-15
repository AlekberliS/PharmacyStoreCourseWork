let cards = document.querySelectorAll('.cards__product');

cards.forEach(card => {
    card.addEventListener('mouseover', function() {
        handleProductImage(this, true);
    });

    card.addEventListener('mouseout', function() {
        handleProductImage(this, false);
    });
});

function handleProductImage(card, isHover) {
    const img = card.querySelector("img");
    if (isHover) {
        img.src = addWhToUrl(img.src);
    } else {
        img.src = removeWhFromUrl(img.src);
    }
}

function addWhToUrl(url) {
    if (url.endsWith('wh.svg')) {
        return url;
    }
    return url.replace('.svg', 'wh.svg');
}

function removeWhFromUrl(url) {
    if (url.endsWith('wh.svg')) {
        return url.replace('wh.svg', '.svg');
    }
    return url;
}

let cartHeart = document.createElement('img');
cartHeart.src = './assets/images/FillHeart.svg';
cartHeart.classList.add('cart__heart');
cartHeart.alt = 'heartImg';

let products = [];
let bestProducts = [];

let currentPage = 1;
const productsPerPage = 4;
const productsBestPerPage = 4;

// Fetch products data
fetchProducts('/productss.json')
  .then(data => {
    products = data;
    displayProducts(currentPage);
   
  })
  .catch(error => console.log('error:', error));


  
function fetchProducts(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
     
      let storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      data.forEach(product => {
        const index = storedWishlist.findIndex(item => item.id === product.id);
        if (index !== -1) {
          product.isInWishlist = true;
        } else {
          product.isInWishlist = false;
        }
      });
      return data;
    });
}
  
function displayProducts(page) {
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const cardsContainer = document.querySelector('.cards__cards');
  cardsContainer.innerHTML = '';

  paginatedProducts.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('cards__item');

    const cardContent = `
      <div class="cards__img">
          <img class="cart__img__main" src="${product.image}" alt="cardimg">
          <img class="cart__eye" src="${cartEyeIcons}" alt="eyeimg">
          <img class="cart__heart" src="${product.isInWishlist ? './assets/images/favorite.png' : './assets/images/FillHeart.svg'}" alt="heartImg">
      </div>
      <div class="cards__des">
        <p class="cart__name">${product.title.length > 23 ? product.title.slice(0, 24).concat("...") : product.title}</p>
        <div class="cart__price">
            <span class="sale">$${product.price}</span> <span class="normal">$${((product.price)*1.2).toFixed(2)}</span>
        </div>
        <div class="cart__det">
          <div class="cart__rating">
            ${createRatingStars(product.rating.rate)}
          </div>
          <span class="count">(${product.rating.count})</span>
        </div>
      </div>`;

    card.innerHTML = cardContent;
    const cartEyeIcon = card.querySelector('.cart__eye');
    const cartHeartIcon = card.querySelector('.cart__heart');

    cartEyeIcon.addEventListener('click', () => {
      redirectToProductDetail(product);
    });

    cartHeartIcon.addEventListener('click', () => {
      toggleWishlist(product, cartHeartIcon);
      getWishlistItemCount();
      window.location.reload();
    });

    let cardImg = card.querySelector('.cards__img');
    cardImg.addEventListener('mouseenter', () => {
      const addToCartText = document.createElement('div');
      addToCartText.classList.add('add-to-cart-text');
      addToCartText.textContent = 'Add to Cart';
      cardImg.appendChild(addToCartText);

      addToCartText.addEventListener('click', () => {
        const cartItem = {
          productId: product.id,
          quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        let existingCartItem = cart.find(item => item.productId === cartItem.productId);
        if (existingCartItem) {
          existingCartItem.quantity++;
        } else {
          cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        window.location.reload();

        updateCartIconQuantity();
      });

    });

    cardImg.addEventListener('mouseleave', () => {
      const addToCartText = card.querySelector('.add-to-cart-text');
      if (addToCartText) {
        addToCartText.remove();
      }
    });

    cardsContainer.appendChild(card);
  });

  updatePagination();
}


function getTotalCartQuantity() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalQuantity = 0;

  cart.forEach(item => {
    totalQuantity += item.quantity;
  });

  return totalQuantity;
}
function updateCartIconQuantity() {
  const cartHeaderIcon = document.querySelector('.header__cart');
  const totalQuantity = getTotalCartQuantity();

  const quantitySpan = document.createElement('span');
  quantitySpan.textContent = totalQuantity;
  quantitySpan.classList = 'quantity__span';

  if (totalQuantity === 0) {
    quantitySpan.textContent = '0';
  }

  cartHeaderIcon.innerHTML = '';
  cartHeaderIcon.appendChild(quantitySpan);
}


updateCartIconQuantity();



function redirectToProductDetail(product) {
  window.location.href = `/productDetail.html?productId=${product.id}&productName=${encodeURIComponent(product.title)}&productPrice=${product.price}`;
}

function toggleWishlist(product, heartIcon) {
  product.isInWishlist = !product.isInWishlist;
  heartIcon.src = product.isInWishlist ? './assets/images/favorite.png' : './assets/images/FillHeart.svg';
  updateLocalStorage(product);
}

function updateLocalStorage(product) {
  let storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const index = storedWishlist.findIndex(item => item.id === product.id);

  if (index !== -1) {
    storedWishlist.splice(index, 1);
  } else {
    storedWishlist.push({ id: product.id });
  }

  localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
}
function findBestProducts(products) {
  
  return products.sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4);
}


function createRatingStars(rate) {
  let stars = '';

  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rate)) {
      stars += '<img src="../assets/images/starr.svg" alt="star" class="star-icon">';
    } else if (i === Math.floor(rate) && rate % 1 !== 0) {
      stars += '<img src="../assets/images/star-half-filled.svg" alt="star" class="star-icon">';
    } else {
      stars += '<img src="../assets/images/starfree.svg" alt="star" class="star-icon">';
    }
  }

  return stars;
}

function updatePagination() {
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginationContainer = document.querySelector('.head2__chevron');
  paginationContainer.innerHTML = '';

  const leftArrow = document.createElement('img');
  leftArrow.src = "./assets/images/FillWithLeftArrrow.svg";
  leftArrow.alt = "left";
  leftArrow.classList.add('left-arrow');
  leftArrow.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayProducts(currentPage);
    }
  });
  paginationContainer.appendChild(leftArrow);

  const rightArrow = document.createElement('img');
  rightArrow.src = "./assets/images/FillwithRightArrrow.svg";
  rightArrow.alt = "right";
  rightArrow.classList.add('right-arrow');
  rightArrow.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayProducts(currentPage);
    }
  });
  paginationContainer.appendChild(rightArrow);
}

function counter() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);
  endDate.setHours(endDate.getHours() + 23);
  endDate.setMinutes(endDate.getMinutes() + 19);
  endDate.setSeconds(endDate.getSeconds() + 56);

  startCountdown(endDate);
  console.log("Window loaded!") ;

}

function startCountdown(endDate) {
  const countdownTimer = setInterval(function() {
    const now = new Date().getTime();
    const distance = endDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdownElement = document.querySelector('.head2__time');
    countdownElement.innerHTML = `<span class="days top">Days</span><span class = "divider">:</span><span class= "time">0${days}</span>
      <span class="hours top">Hours</span><span class = "divider">:</span> <span class= "time hourst">${hours}</span>
      <span class="minutes top"> Minutes</span><span class = "divider">:</span><span class= "time">${minutes}</span>
      <span class="seconds top">Seconds</span><span class= "time"> ${seconds}</span>`;
    if (distance < 0) {
      clearInterval(countdownTimer);
      countdownElement.innerHTML = "Expired";
    }
  }, 1000);
}

counter();

let allProducts = [];
let currentPageCount = 3;
const productsPerPageCount = 4;

const categoryCards = document.querySelectorAll('.category[data-category]');

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        
        sessionStorage.setItem('selectedCategory', category);
        
        window.location.href = `category.html?category=${category}`;
    });
});

let allProduct = document.querySelectorAll('.all__btn');

allProduct.forEach(button => {
    button.addEventListener("click", () => {
      
        window.location.href = `allProducts.html?viewAllProduct`;
    });
});

