import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(outputSelector) {
    this.outputSelector = outputSelector;
    this.externalServices = new ExternalServices();
  }

  // Calculate and display item subtotal
  calculateItemSubtotal() {
    const cartItems = getLocalStorage("so-cart") || [];
    const subtotal = cartItems.reduce((total, item) => {
      return total + parseFloat(item.FinalPrice);
    }, 0);

    // Display subtotal in the order summary
    const subtotalElement = document.querySelector(`${this.outputSelector} .order-subtotal`);
    if (subtotalElement) {
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    return subtotal;
  }

  // Calculate and display tax, shipping, and order total
  calculateOrderTotals(zipCode) {
    const subtotal = this.calculateItemSubtotal();
    
    // Calculate tax (6% of subtotal)
    const tax = subtotal * 0.06;
    
    // Calculate shipping ($10 for first item, $2 for each additional)
    const cartItems = getLocalStorage("so-cart") || [];
    const shipping = cartItems.length > 0 ? 10 + (cartItems.length - 1) * 2 : 0;
    
    // Calculate total
    const orderTotal = subtotal + tax + shipping;

    // Update order summary
    const taxElement = document.querySelector(`${this.outputSelector} .order-tax`);
    const shippingElement = document.querySelector(`${this.outputSelector} .order-shipping`);
    const totalElement = document.querySelector(`${this.outputSelector} .order-total`);

    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${orderTotal.toFixed(2)}`;

    return {
      subtotal,
      tax,
      shipping,
      orderTotal
    };
  }

  // Prepare items for checkout
  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: parseFloat(item.FinalPrice),
      quantity: 1
    }));
  }

  // Handle checkout process
  async checkout(form) {
    // Prevent default form submission
    event.preventDefault();

    // Convert form data to JSON
    const formData = new FormData(form);
    const jsonOrder = Object.fromEntries(formData.entries());

    // Prepare full order object
    const orderDetails = {
      orderDate: new Date().toISOString(),
      fname: jsonOrder.firstName,
      lname: jsonOrder.lastName,
      street: jsonOrder.street,
      city: jsonOrder.city,
      state: jsonOrder.state,
      zip: jsonOrder.zipCode,
      cardNumber: jsonOrder.cardNumber,
      expiration: jsonOrder.expiration,
      code: jsonOrder.securityCode,
      items: this.packageItems(getLocalStorage("so-cart") || []),
      ...this.calculateOrderTotals()
    };

    try {
      // Send order to external services
      const response = await this.externalServices.checkout(orderDetails);
      console.log('Order submitted successfully:', response);
      // TODO: Add success handling (redirect, display message, etc.)
    } catch (error) {
      console.error('Checkout failed:', error);
      // TODO: Add error handling (display error message)
    }
  }

  // Initialize checkout process
  init() {
    // Add event listeners, calculate initial totals, etc.
    this.calculateItemSubtotal();

    // Listen for zip code input to update totals
    const zipInput = document.querySelector(`${this.outputSelector} [name="zipCode"]`);
    if (zipInput) {
      zipInput.addEventListener('change', () => this.calculateOrderTotals());
    }

    // Add form submission handler
    const checkoutForm = document.querySelector('form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (event) => this.checkout(checkoutForm));
    }
  }
}