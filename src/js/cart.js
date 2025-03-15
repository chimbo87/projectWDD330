import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  
  // Handle case when cart is empty or null
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = '<p>Your cart is empty</p>';
    displayCartTotal(0); // Display $0 total when cart is empty
  } else {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    
    // Calculate and display the cart total
    const total = calculateCartTotal(cartItems);
    displayCartTotal(total);
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function calculateCartTotal(cartItems) {
  // Sum up the prices of all items in the cart
  return cartItems.reduce((total, item) => {
    // Convert string price to number if necessary and add to total
    const itemPrice = parseFloat(item.FinalPrice);
    return total + itemPrice;
  }, 0);
}

function displayCartTotal(total) {
  // Check if the cart footer exists, if not create it
  let cartFooter = document.querySelector('.cart-footer');
  
  if (!cartFooter) {
    const productList = document.querySelector('.product-list');
    cartFooter = document.createElement('div');
    cartFooter.classList.add('cart-footer');
    productList.after(cartFooter);
  }
  
  // Format the total with two decimal places
  const formattedTotal = total.toFixed(2);
  
  // Update the cart footer with the total
  cartFooter.innerHTML = `
    <div class="cart-total">
      <h3>Total:</h3>
      <p>$${formattedTotal}</p>
    </div>
  `;
}

renderCartContents();