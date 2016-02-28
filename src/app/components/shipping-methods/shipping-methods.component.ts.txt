// Get shipping methods by address
$('body').on('click', '.js-shipping-address__btn-save', function () {

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
$('body').on('click', '.js-shipping-methods__btn-save', function () {

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
