import {Injectable} from '@angular/core';

@Injectable()
export class FeaturedService {
  public content = `
<div class="blocks-promo">
   <a href="http://m2.rocwang.me/collections/yoga-new.html" class="block-promo home-main">
       <img src="http://m2.rocwang.me/media/wysiwyg/home/home-main.jpg" alt="">
       <span class="content bg-white">
           <span class="info">New Luma Yoga Collection</span>
           <strong class="title">Get fit and look fab in new seasonal styles</strong>
           <span class="action more button">Shop New Yoga</span>
       </span>
   </a>
   <div class="block-promo-wrapper block-promo-hp">
       <a href="http://m2.rocwang.me/promotions/pants-all.html" class="block-promo home-pants">
           <img src="http://m2.rocwang.me/media/wysiwyg/home/home-pants.jpg" alt="">
           <span class="content">
               <strong class="title">20% OFF</strong>
               <span class="info">Luma pants when you shop today*</span>
               <span class="action more icon">Shop Pants</span>
           </span>
       </a>
       <a href="http://m2.rocwang.me/promotions/tees-all.html" class="block-promo home-t-shirts">
           <span class="image"><img src="http://m2.rocwang.me/media/wysiwyg/home/home-t-shirts.png" alt=""></span>
           <span class="content">
               <strong class="title">Even more ways to mix and match</strong>
               <span class="info">Buy 3 Luma tees get a 4th free</span>
               <span class="action more icon">Shop Tees</span>
           </span>
       </a>
       <a href="http://m2.rocwang.me/collections/erin-recommends.html" class="block-promo home-erin">
           <img src="http://m2.rocwang.me/media/wysiwyg/home/home-erin.jpg" alt="">
           <span class="content">
               <strong class="title">Take it from Erin</strong>
               <span class="info">Luma founder Erin Renny shares her favorites!</span>
               <span class="action more icon">Shop Erin Recommends</span>
           </span>
       </a>
       <a href="http://m2.rocwang.me/collections/performance-fabrics.html" class="block-promo home-performance">
           <img src="http://m2.rocwang.me/media/wysiwyg/home/home-performance.jpg" alt="">
           <span class="content bg-white">
               <strong class="title">Science meets performance</strong>
               <span class="info">Wicking to raingear, Luma covers&nbsp;you</span>
               <span class="action more icon">Shop Performance</span>
           </span>
       </a>
       <a href="http://m2.rocwang.me/collections/eco-friendly.html" class="block-promo home-eco">
           <img src="http://m2.rocwang.me/media/wysiwyg/home/home-eco.jpg" alt="">
           <span class="content bg-white">
               <strong class="title">Twice around, twice as nice</strong>
               <span class="info">Find conscientious, comfy clothing in our <nobr>eco-friendly</nobr> collection</span>
               <span class="action more icon">Shop Eco-Friendly</span>
           </span>
       </a>
   </div>
</div>
`;
}
