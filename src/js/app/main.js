/*global client */

// Get cart ID
function fetchCartId() {
  if (localStorage.getItem('cartId')) {
    loadCatalog();
    refreshCart();
  } else {
    client.quoteGuestCartManagementV1.quoteGuestCartManagementV1CreateEmptyCartPost().then(function (data) {
      console.log('Cart Id:', data);
      localStorage.setItem('cartId', data.data.replace(/"/g, ''));
      loadCatalog();
      refreshCart();
    });
  }
}

// Product list
function loadCatalog() {
  client.catalogProductRepositoryV1.catalogProductRepositoryV1GetListGet({
    'searchCriteria[filter_groups][0][filters][0][field]'         : 'visibility',
    'searchCriteria[filter_groups][0][filters][0][value]'         : '4',
    'searchCriteria[filter_groups][0][filters][0][condition_type]': 'like',
    'searchCriteria[pageSize]'                                    : 4,
    'searchCriteria[currentPage]'                                 : 1,
  }).then(function (data) {

    console.log('Products:', data.obj);

    var templateProduct = document.querySelector('#template-product').content;
    var container = document.querySelector('#product-grid');

    data.obj.items.forEach(function (element) {
      // Find the product image
      var imgSrc = '';
      element.custom_attributes.forEach(function (element) {
        if (element.attribute_code === 'small_image') {
          imgSrc = 'http://m2.dev/media/catalog/product' + element.value;
        }
      });

      templateProduct.querySelector('.js-product__image').src = imgSrc;
      templateProduct.querySelector('.js-product__name').textContent = element.name;
      templateProduct.querySelector('.js-product__price').textContent = element.price;
      templateProduct.querySelector('.js-product__btn-add-to-cart').dataset.sku = element.sku;

      container.appendChild(document.importNode(templateProduct, true));
    });

  });
}

// Refresh cart
function refreshCart() {

  client.quoteGuestCartTotalRepositoryV1.quoteGuestCartTotalRepositoryV1GetGet({
    cartId: localStorage.getItem('cartId')
  }).then(function (data) {
    console.log('Cart:', data.obj);

    var templateProduct = document.querySelector('#template-cart-item').content;
    var container = document.querySelector('#cart');

    container.innerHTML = '';

    data.obj.items.forEach(function (element) {
      templateProduct.querySelector('.js-cart-item__name').textContent = element.name;
      templateProduct.querySelector('.js-cart-item__qty').textContent = element.qty;
      templateProduct.querySelector('.js-cart-item__price').textContent = element.price;

      container.appendChild(document.importNode(templateProduct, true));
    });

    data.obj.total_segments.forEach(function (element) {
      templateProduct.querySelector('.js-cart-item__name').textContent = element.title;
      templateProduct.querySelector('.js-cart-item__qty').textContent = '';
      templateProduct.querySelector('.js-cart-item__price').textContent = element.value;

      container.appendChild(document.importNode(templateProduct, true));
    });

    container.appendChild(document.importNode(templateProduct, true));
  });

}

// Add to cart
$('body').on('click', '.js-product__btn-add-to-cart', function () {

    client.quoteGuestCartItemRepositoryV1.quoteGuestCartItemRepositoryV1SavePost({
      cartId: localStorage.getItem('cartId'),
      $body : {
        'cartItem': {
          "quote_id": localStorage.getItem('cartId'),
          'sku'     : this.dataset.sku,
          'qty'     : 1,
        }
      }
    }).then(function (data) {
      console.log('Add to cart: ', data.obj);
      refreshCart();
    });

  })
  // Place order
  .on('click', '.js-product__btn-place-order', function () {
  });

/*global SwaggerClient */
new SwaggerClient({
  url       : 'http://m2.dev/rest/schema',
  usePromise: true,
}).then(function (client) {
  console.log('API loaded');
  window.client = client;
  fetchCartId();
});
