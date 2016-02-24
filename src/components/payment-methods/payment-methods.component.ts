// Save Shipping Address & Method
$('body').on('click', '.js-payment__btn-place-order', function () {

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
