renderCheckout();
updateCartQuantityPage();
function renderCheckout() {
  let checkoutHTML = "";
  cart.forEach((cartItem) => {
    const { productId } = cartItem;
    let matchingProduct;
    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });
    checkoutHTML += `
    <div class="cart-item-container cart-item-container-${productId}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${(matchingProduct.priceCents / 100).toFixed(2)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${productId}">${
                      cartItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id=${productId}>
                    Update
                  </span>
                  <input type="text" class="quantity-input js-quantity-input js-quantity-input-${productId}">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id=${productId}>Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productId}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${productId}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${productId}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${productId}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;
  });
  document.querySelector(".js-order-summary").innerHTML = checkoutHTML;
}
document.querySelectorAll(".js-delete-link").forEach((button) => {
  button.addEventListener("click", () => {
    let { productId } = button.dataset;
    let newArray = [];
    cart.forEach((cartItem, index) => {
      if (cartItem.productId !== productId) {
        newArray.push(cartItem);
      }
    });
    cart = newArray;
    updateCartQuantityPage();
    localStorage.setItem("cart", JSON.stringify(cart));
    document.querySelector(`.cart-item-container-${productId}`).remove();
  });
});

function updateCartQuantityPage() {
  let totalQuantity = 0;
  cart.forEach((product) => {
    totalQuantity += product.quantity;
  });
  document.querySelector(".js-return-to-home-link").innerHTML =
    totalQuantity + " items";
}

document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    let { productId } = link.dataset;
    document
      .querySelector(`.cart-item-container-${productId}`)
      .classList.add("is-editing-quantity");
  });
});
document.querySelectorAll('.js-save-link')
  .forEach((link) => {
    const productId = link.dataset.productId;
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    // Click event
    link.addEventListener('click', () => {
      handleUpdateQuantity(productId, quantityInput);
      
    });
    
    // Keydown event
    quantityInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleUpdateQuantity(productId, quantityInput);
      }
    });
});
  
function handleUpdateQuantity(productId, quantityInput) {
  const newQuantity = Number(quantityInput.value);
  if (newQuantity <= 0 || newQuantity >= 1000) {
    alert('Quantity must be at least 1 and less than 1000 ');
    return; 
  }

  updateNewCartQuantity(productId, newQuantity);

  const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
  quantityLabel.innerHTML = newQuantity;

  updateCartQuantityPage();

  const container = document.querySelector(`.cart-item-container-${productId}`);
  container.classList.remove('is-editing-quantity');
}

function updateNewCartQuantity(newQuantity, productId) {
  
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  });
  localStorage.setItem("cart", JSON.stringify(cart));
}

