import {Component, OnInit} from 'angular2/core';
import {Product} from '../../typings/product';
import {CartService} from '../../services/cart.service';
import {CatalogService} from '../../services/catalog.service';

@Component({
  selector   : 'catalog',
  templateUrl: 'app/components/catalog/catalog.component.html',
  styleUrls: ['app/components/catalog/catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  title = 'Catalog';

  constructor(private catalog: CatalogService,
              private _cart: CartService) {
  }

  ngOnInit() {
    this.catalog.getProducts();
  }

  add(product: Product, productImg: HTMLElement) {
    if (!product.isAdding) {

      product.isAdding = true;

      this._cart.add(product).subscribe(() => {

        product.isAdding = false;

        this.animate(productImg, '#icon-cart').then(() => {

          $('#icon-cart').transition({
            animation : 'jiggle',
            duration  : 800,
            onComplete: () => {
              this._cart.refresh(true);
            }
          });

        });

      });
    }
  }

  animate(srcElement: HTMLElement, targetSelector: string) {
    var src = $(srcElement);
    var clone = src.clone();
    var target = $(targetSelector);

    var srcCoordinates = src.offset();
    var targetCoordinates = target.offset();

    clone.css({
      position          : 'absolute',
      top               : 0,
      left              : 0,
      width             : src.width(),
      height            : src.height(),
      transform         : 'translate(' + srcCoordinates.left + 'px,' + srcCoordinates.top + 'px)',
      opacity           : 1,
      'transform-origin': 'top left',
      transition        : 'transform 1s cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity 1s cubic-bezier(0.6, -0.28, 0.735, 0.045)',
      'z-index'         : 110
    }).appendTo('body');

    return new Promise(resolve => {
      clone.on('transitionend', function (e) {
        if ((<TransitionEvent>e.originalEvent).propertyName === 'opacity') {
          $(this).remove();

          resolve();
        }
      }) .css({
        transform: 'translate(' + targetCoordinates.left + 'px,' + targetCoordinates.top + 'px)'
        + 'scale(' + target.width() / src.width() + ',' + target.height() / src.height() + ')',
        opacity  : 0
      });
    });
  }
}

