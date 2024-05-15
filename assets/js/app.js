const term = window.location.search;
const search = new URLSearchParams(term);
const userID = search.get("userId");
let userIcon = document.querySelector('.userImg');



const dropdownMenu = document.getElementById('dropdownMenu');

const originalIconSrc = '/assets/images/User=Off.svg'; 

userIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hide');

    if (userIcon.src.includes('User=On.svg')) {
        userIcon.src = '/assets/images/User=Off.svg';
    } else {
        userIcon.src = '/assets/images/User=On.svg';  
    }
});
if (window.location.href.includes('/account.html') && userIcon.src.includes('User=On.svg')) {
    
    userIcon.src = '/assets/images/User=On.svg';  
}
const logOut = document.querySelector('.logOutUser');

logOut.addEventListener('click', () => {
  
    logOutUser();

   
    showPopup();
});



const profileLink = document.getElementById('profileLink');
const settingsLink = document.getElementById('settingsLink');
const logoutLink = document.getElementById('logoutLink');

let cartEyeIcons = '/assets/images/FillEye.svg';

let wishlistIcon = document.querySelector('.heart__icon');


function getWishlistItemCount() {
 
    let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    let itemCount = wishlistItems.length;
    wishlistIcon.dataset.count = itemCount;
    let count = document.createElement('span');
    count.innerText= itemCount;
    
   
}

let cartHeaderIcon = document.querySelector('.header__cart');
let cart = JSON.parse(localStorage.getItem('cart'))
if (cart){

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
    quantitySpan.classList = 'quantity__span'
  
    if (totalQuantity.length === 0) {
      quantitySpan.textContent = '0';
    }
  
    cartHeaderIcon.insertAdjacentElement('afterend', quantitySpan);
    cartHeaderIcon.addEventListener('click',()=>{
      window.location.href = '/cart.html';
    })
  }
  
  updateCartIconQuantity();
  

function goToCart(){
    window.location.href = '/cart.html';
}
let wishlistNav = document.querySelector('.heart__icon');
wishlistNav.addEventListener('click',()=>{
    window.location.href ='/wishlist.html';
   
})
function goToWishlist(){
    window.location.href ='/wishlist.html';
    updateWishlistItemCount();
}


const wishlistIconn = document.querySelector('.heart__icon');
window.onload = function() {
    updateWishlistItemCount();
};

function updateWishlistItemCount() {

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const count = wishlist.length;
const span = document.createElement('span');
span.classList.add('wishlist-item-count');
        wishlistIconn.parentNode.insertBefore(span, wishlistIcon.nextSibling);
    if (count === 0) {
       span.textContent = 0;
        
    }
    else{
                span.textContent = count;
            }
}


