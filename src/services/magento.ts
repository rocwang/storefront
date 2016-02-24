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
