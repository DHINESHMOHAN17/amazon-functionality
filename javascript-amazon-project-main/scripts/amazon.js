// import {cart} from "../data/cart";
// import {products} from "../data/products";
updateCartQuantity();
let productHTML = "";
products.forEach((product) => {
  productHTML += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
            product.id
          }">
            Add to Cart
          </button>
        </div>
    `;
});
document.querySelector(".js-products-grid").innerHTML = productHTML;

document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  let timeoutId;
  button.addEventListener("click", () => {
    let { productId } = button.dataset;
    let quantity = Number(
      document.querySelector(`.js-quantity-selector-${productId}`).value
    );
    let inProductCart = false;
    cart.forEach((items) => {
      if (productId === items.productId) {
        items.quantity += quantity;
        inProductCart = true;
      }
    });
    if (inProductCart === false) {
      cart.push({
        productId,
        quantity,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartQuantity();
    let addElement = document.querySelector(
      `.js-added-to-cart-${productId}`
    ).classList;
    addElement.add("added-to-cart-visible");
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      addElement.remove("added-to-cart-visible");
    }, 2000);
  });
});

function updateCartQuantity() {
  let totalQuantity = 0;
  cart.forEach((product) => {
    totalQuantity += product.quantity;
  });
  if(totalQuantity===0) totalQuantity="";  
    document.querySelector(".js-cart-quantity").innerHTML = totalQuantity; 
}
