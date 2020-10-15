# An Angular 2 storefront app for Magento 2

[Demo video](./demo.webm)

Magento 2 comes with rich [REST API](http://devdocs.magento.com/guides/v2.0/get-started/bk-get-started-api.html)
support, which contains almost every features you can find in the native front end. So in theory, we can build
a standalone web app as an alternative storefront, which consumes the API provided by a headless Magento 2 instance.

As a proof of concept, I've been playing with Magento 2 and Angular 2 recently and built a
[Single Page App](https://en.wikipedia.org/wiki/Single-page_application), in which you can browse the catalog,
add products to cart and place a order. You can play with it at [http://storefront.rocwang.me/](http://storefront.rocwang.me/).
Note that it's still a prototype, and only tested under the newest Chrome, Firefox and Opera.

## Magento 2 REST API

The REST API in Magento 2 gets much better support compared to Magento 1. Even better, it has [Swagger](http://swagger.io/) schema support,
which is like WSDL to SOAP. With this under our belt, we can [automate the API document generation](http://devdocs.magento.com/swagger/index.html)
and [client code generation](https://github.com/swagger-api/swagger-codegen).
There is even [a Javascript library](https://github.com/swagger-api/swagger-js)
which can consume the API and build the client stub on the fly, right in your browser!

To expose the API to a client, which might be running from a different domain to your Magento instance, we need to enable
[Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) in your Magento's web server.

Example configuration for Apache:

    # Always set these headers.
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
    Header always set Access-Control-Max-Age "86400"
    Header always set Access-Control-Allow-Headers "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token"

    # Added a rewrite to respond with a 200 SUCCESS on every OPTIONS request.
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]

## Advantages

With the SPA architecture, we separate the static part and the dynamic part in Magento. This gives us a lot of benefits:

### Flexibility

By getting rid of the complex page-based Magento layout and template system, it opens infinite possibilities for the front end design,
with zero impact on the Magento side and the server. You can design the UI to be whatever we like, experiment with all of
the cutting edge browser features you dreamed of, and deliver the best user experience you can think of. You can event
rebuild the Magento admin UI as well.

### Performance

Without composing and rendering the page on the server side, Magento is running as a service, while the
representational layer is handled by user's browser. Only dynamic data is
exchanged between the server and the browser via the API, this may reduce your server load dramatically and make your
store much more responsive.

What's better is, you don't need to worry about page cache/hole punching any more (I'm talking to you, Varnish). You
may still need performance optimization eventually, but now the concerns are separated.
You just easily focus your optimization on the API side, or the front end side.

### Scalability & Accessibility

The static/dynamic separation enable us to scale the application much more easily as well. For the front end part, we
could just throw the prebuilt storefront to CDN and make your store faster. If built properly, the storefront could be
accessible even offline. Imagine the user experience you deliver when the user could view your catalog even when
internet is not available or you are taking Magento offline for a scheduled maintenance!

## Challenges

Even tough the Magento is headless now, we still need a nicely built "head". Apart from the amount of work to rebuild
every front end feature we like in Magento and add new fancy features. There are others Challenges specifically for SPA.

### SEO & speed of initial load

We are building a e-commerce app here, search engine discoverability is crucial to our business!
However, the app loads contents like category and products progressively with Javascript, which might be hard for
Google and other search engines to find the catalog data. Further than that, this progressive/lazy loading behavior might be a good
user experience during the running of app, but it may feels slow to the first time visitor. No one like the spinner,
right?

To resolve these 2 issues, we could turn to a technique call Server Side Rendering, but that deserve another post.

### Payment gateway integration

The integration among payment gateways, Magento and our app is definitely possible, but it needs careful implementation.

## Some facts about the app

| Languages               | Build time dependencies | Run time dependencies |
| ----------------------- | ----------------------- | --------------------- |
| Angular 2 flavored HTML | Gulp and its plugins    | Angular 2             |
| SCSS -> CSS             | Browsersync             | jQuery                |
| Typescript -> JS        | ...                     | Semantic UI           |
|                         |                         | System JS             |
|                         |                         | ...                   |

## Start the container

    docker run --name storefront -e VIRTUAL_HOST=storefront.rocwang.me -d rocwang/storefront
