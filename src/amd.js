(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["underscore", "backbone", "backbone.babysitter"], factory);
    }
}(this, function (_, Backbone) {
  //= backbone.pickysitter.js
  return Backbone.Picky;
}));
