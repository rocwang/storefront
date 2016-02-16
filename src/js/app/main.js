/*global client */

// Get cart ID
function fetchCartId(cb) {
  if (localStorage.getItem('cartId')) {

    cb();

  } else {
    client.quoteGuestCartManagementV1.quoteGuestCartManagementV1CreateEmptyCartPost().then(function (data) {
      console.log('Cart Id:', data);
      localStorage.setItem('cartId', data.data.replace(/"/g, ''));

      cb();
    });
  }
}

// Product list
function loadCatalog() {
  client.catalogProductRepositoryV1.catalogProductRepositoryV1GetListGet({
    'searchCriteria[filter_groups][0][filters][0][field]'         : 'visibility',
    'searchCriteria[filter_groups][0][filters][0][value]'         : '4',
    'searchCriteria[filter_groups][0][filters][0][condition_type]': 'like',
    'searchCriteria[pageSize]'                                    : 8,
    'searchCriteria[currentPage]'                                 : 1,
  }).then(function (data) {

    console.log('Products:', data.obj);

    var container = document.querySelector('#product-grid');

    data.obj.items.forEach(function (element) {
      // Find the product image
      var imgSrc = '';
      element.custom_attributes.forEach(function (element) {
        if (element.attribute_code === 'small_image') {
          imgSrc = 'http://m2.dev/media/catalog/product' + element.value;
        }
      });

      var template = document.importNode(document.querySelector('#template-product').content, true);

      template.querySelector('.js-product__image').src = imgSrc;
      template.querySelector('.js-product__name').textContent = element.name;
      template.querySelector('.js-product__price').textContent = element.price;
      template.querySelector('.js-product__btn-add-to-cart').dataset.sku = element.sku;

      container.appendChild(template);
    });

  });
}

// Refresh cart
function refreshCart() {
  client.quoteGuestCartTotalRepositoryV1.quoteGuestCartTotalRepositoryV1GetGet({
    cartId: localStorage.getItem('cartId')
  }).then(function (data) {
    console.log('Cart:', data.obj);

    updateCartUi(data.obj)
  });
}

function updateCartUi(total) {
  var container = document.querySelector('#cart');
  container.innerHTML = '';


  total.items.forEach(function (element) {
    var template = document.importNode(document.querySelector('#template-cart-item').content, true);

    template.querySelector('.js-cart-item__name').textContent = element.name;
    template.querySelector('.js-cart-item__qty').textContent = element.qty;
    template.querySelector('.js-cart-item__price').textContent = element.price;

    container.appendChild(template);
  });

  total.total_segments.forEach(function (element) {
    var template = document.importNode(document.querySelector('#template-cart-item').content, true);

    template.querySelector('.js-cart-item__name').textContent = element.title;
    template.querySelector('.js-cart-item__qty').textContent = '';
    template.querySelector('.js-cart-item__price').textContent = element.value;

    container.appendChild(template);
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
  // Get shipping methods by address
  .on('click', '.js-shipping-address__btn-save', function () {

    client.quoteGuestShippingMethodManagementV1.quoteGuestShippingMethodManagementV1EstimateByAddressPost({
      cartId: localStorage.getItem('cartId'),
      $body : {
        "address": {
          "region"   : document.getElementById('shipping-address__region').value,
          "countryId": document.getElementById('shipping-address__country').value,
          "postcode" : document.getElementById('shipping-address__post-code').value,
        }
      }
    }).then(function (data) {
      console.log('Get shipping methods: ', data.obj);

      var container = document.querySelector('#shipping-methods');
      container.innerHTML = '';


      data.obj.forEach(function (element) {
        var template = document.importNode(document.querySelector('#template-shipping-methods').content, true);

        var input = template.querySelector('.js-shipping-methods__input');
        input.value = element.carrier_code + '>' + element.method_code;
        input.dataset.carrier_code = element.carrier_code;
        input.dataset.method_code = element.method_code;

        template.querySelector('.js-shipping-methods__price-incl-tax').textContent = element.price_incl_tax;
        template.querySelector('.js-shipping-methods__method-title').textContent = element.method_title;
        template.querySelector('.js-shipping-methods__carrier-title').textContent = element.carrier_title;

        container.appendChild(template);
      });
    });

  })
  // Save Shipping Address & Method
  .on('click', '.js-shipping-methods__btn-save', function () {

    client.checkoutGuestShippingInformationManagementV1.checkoutGuestShippingInformationManagementV1SaveAddressInformationPost({
      cartId: localStorage.getItem('cartId'),
      $body : {
        "addressInformation": {
          "shippingAddress"    : {
            "region"   : document.getElementById('shipping-address__region').value,
            "regionId" : 0,
            "company"  : '',
            "countryId": document.getElementById('shipping-address__country').value,
            "street"   : [
              document.getElementById('shipping-address__street-1').value,
              document.getElementById('shipping-address__street-2').value
            ],
            "telephone": document.getElementById('shipping-address__phone').value,
            "postcode" : document.getElementById('shipping-address__post-code').value,
            "city"     : document.getElementById('shipping-address__city').value,
            "firstname": document.getElementById('shipping-address__first-name').value,
            "lastname" : document.getElementById('shipping-address__last-name').value,
          },
          "billingAddress"     : {
            "region"   : document.getElementById('shipping-address__region').value,
            "regionId" : 0,
            "company"  : '',
            "countryId": document.getElementById('shipping-address__country').value,
            "street"   : [
              document.getElementById('shipping-address__street-1').value,
              document.getElementById('shipping-address__street-2').value
            ],
            "telephone": document.getElementById('shipping-address__phone').value,
            "postcode" : document.getElementById('shipping-address__post-code').value,
            "city"     : document.getElementById('shipping-address__city').value,
            "firstname": document.getElementById('shipping-address__first-name').value,
            "lastname" : document.getElementById('shipping-address__last-name').value,
          },
          "shippingMethodCode" : $('.js-shipping-methods__input:checked').data('method_code'),
          "shippingCarrierCode": $('.js-shipping-methods__input:checked').data('carrier_code'),
        }
      }
    }).then(function (data) {
      console.log('Shipping Address: ', data.obj);

      var container = document.querySelector('#payment');
      container.innerHTML = '';

      data.obj.payment_methods.forEach(function (element) {
        var template = document.importNode(document.querySelector('#template-payment').content, true);

        var input = template.querySelector('.js-payment__input');
        input.value = element.code;
        input.dataset.code = element.code;

        template.querySelector('.js-payment__title').textContent = element.title;

        container.appendChild(template);
      });

      updateCartUi(data.obj.totals);
    });

  })
  // Save Shipping Address & Method
  .on('click', '.js-payment__btn-place-order', function () {

    client.checkoutGuestPaymentInformationManagementV1.checkoutGuestPaymentInformationManagementV1SavePaymentInformationAndPlaceOrderPost({
      cartId: localStorage.getItem('cartId'),
      $body : {
        "email"        : document.getElementById('shipping-address__email').value,
        "paymentMethod": {
          "poNumber"      : null,
          "method"        : $('.js-payment__input:checked').data('code'),
          "additionalData": null,
        }
      }
    }).then(function (data) {
      console.log('Place order: ', data);

      // Remove the cart ID
      localStorage.removeItem('cartId');

      alert('Order placed!');

      fetchCartId(function() {
        refreshCart();
      });

    });
  });

/*global SwaggerClient */
new SwaggerClient({
  url       : 'http://m2.dev/rest/schema',
  usePromise: true,
}).then(function (client) {
  console.log('API loaded');
  window.client = client;

  fetchCartId(function() {
    loadCatalog();
    refreshCart();
  });
});
