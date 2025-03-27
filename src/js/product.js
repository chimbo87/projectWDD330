import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ExternalServices.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get the current cart items
  let cart = getLocalStorage("so-cart");
  
  console.log("Cart type:", typeof cart);
  console.log("Cart value:", cart);
  
 
  if (!cart) {
    cart = [];
  } else if (!Array.isArray(cart)) {

    cart = [cart];
  }
  
  console.log("Cart after initialization:", cart);
  
  // Now cart should definitely be an array
  const itemIndex = cart.findIndex(item => item.Id === product.Id);
  
  if (itemIndex !== -1) {
    // Product already exists
    alert("This item is already in your cart!");
  } else {
   
    cart.push(product);
    setLocalStorage("so-cart", cart);
    alert("Item added to cart!");
  }
}


async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);