/**
 * Created by roc on 21/02/16.
 */
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
