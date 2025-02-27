import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
renderCheckout();
renderPaymentSummary();
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
    let { deliveryOptionId } = cartItem;
    let deliveryOption;
    deliveryOptions.forEach((delivery) => {
      if (delivery.id === deliveryOptionId) deliveryOption = delivery;
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "day");
    const dayString = deliveryDate.format("dddd, MMMM D");
    checkoutHTML += `
    <div class="cart-item-container cart-item-container-${productId}">
            <div class="delivery-date">
              Delivery date: ${dayString}
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
                    ${deliveryOptionHTML(productId, cartItem.deliveryOptionId)}
              </div>
            </div>
          </div>
    `;
  });
  updateCartQuantityPage();
  document.querySelector(".js-order-summary").innerHTML = checkoutHTML;
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
  document.querySelectorAll(".js-save-link").forEach((link) => {
    const productId = link.dataset.productId;
    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );
    // Click event
    link.addEventListener("click", () => {
      handleUpdateQuantity(productId, quantityInput);
    });

    // Keydown event
    quantityInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleUpdateQuantity(productId, quantityInput);
      }
    });
  });

  function handleUpdateQuantity(productId, quantityInput) {
    const newQuantity = Number(quantityInput.value);
    if (newQuantity <= 0 || newQuantity >= 1000) {
      alert("Quantity must be at least 1 and less than 1000 ");
      return;
    }

    updateNewCartQuantity(productId, newQuantity);

    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityLabel.innerHTML = newQuantity;

    updateCartQuantityPage();

    const container = document.querySelector(
      `.cart-item-container-${productId}`
    );
    container.classList.remove("is-editing-quantity");
  }

  function updateNewCartQuantity(productId, newQuantity) {
    cart.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.quantity = newQuantity;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function deliveryOptionHTML(productId, deliveryOptionId) {
    let deliveryHTML = "";
    deliveryOptions.forEach((delivery) => {
      const today = dayjs();
      const deliveryDate = today.add(delivery.deliveryDays, "day");
      const dayString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        delivery.priceCents === 0
          ? "FREE"
          : `$${(delivery.priceCents / 100).toFixed(2)} -`;
      const isChecked = deliveryOptionId === delivery.id;
      deliveryHTML += `
    <div class="delivery-option js-delivery-option" data-product-id="${productId}" data-delivery-option-id="${
        delivery.id
      }">
        <input type="radio"
        ${isChecked ? " checked" : ""}
        class="delivery-option-input" name="delivery-option-${productId}">
        <div>
            <div class="delivery-option-date">
            ${dayString}
            </div>
            <div class="delivery-option-price">
                ${priceString} Shipping
            </div>
        </div>
    </div>`;
    });
    return deliveryHTML;
  }

  function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) matchingItem = cartItem;
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderCheckout();
      renderPaymentSummary();
    });
  });
}


function renderPaymentSummary(){
  let productPriceCent=0;
  let taxAmount=0;
  cart.forEach((cartItem)=>{
      let {productId,deliveryOptionId}=cartItem;
      let matchingItem=products.find((product)=>productId===product.id);
      let tax=deliveryOptions.find((delivery)=> deliveryOptionId==delivery.id);
      taxAmount+=tax.priceCents;
      productPriceCent+=(matchingItem.priceCents*cartItem.quantity);
  });
  let totalAmount=(productPriceCent+taxAmount);
  let totalAmountWithTax=(totalAmount*0.1);
  let finalAmount=totalAmount+totalAmountWithTax;
  productPriceCent/=100;
  taxAmount/=100;
  totalAmount/=100;
  let totalQuantity = 0;
    cart.forEach((product) => {
      totalQuantity += product.quantity;
    });
  let summaryHTML=`
  <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${totalQuantity}):</div>
          <div class="payment-summary-money">$${productPriceCent.toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$${taxAmount.toFixed(2)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${totalAmount.toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${(totalAmountWithTax/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${(finalAmount/100).toFixed(2)}</div>
        </div>
        <button class="place-order-button button-primary">
          Place your order
        </button>
  `
  document.querySelector('.js-payment-summary').innerHTML=summaryHTML;
}
