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
