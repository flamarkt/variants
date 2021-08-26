module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var a=e[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(r,a,function(e){return t[e]}.bind(null,a));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=12)}([function(t,e){t.exports=flarum.core.compat["common/extend"]},function(t,e){t.exports=flarum.extensions["flamarkt-core"].backoffice["pages/ProductShowPage"]},,function(t,e){t.exports=flarum.extensions["flamarkt-core"].backoffice["components/ProductList"]},function(t,e){t.exports=flarum.core.compat["common/components/Button"]},function(t,e){t.exports=flarum.core.compat["common/components/Switch"]},function(t,e){t.exports=flarum.extensions["flamarkt-core"].common["states/ProductListState"]},function(t,e){t.exports=flarum.core.compat["common/components/LinkButton"]},function(t,e){t.exports=flarum.extensions["flamarkt-core"].backoffice["components/AbstractList"]},,,,function(t,e,n){"use strict";n.r(e),n.d(e,"backoffice",(function(){return g}));var r=n(3),a=n.n(r),o=n(1),i=n.n(o),c=n(6),s=n.n(c),u=n(0),p=n(4),d=n.n(p),l=n(5),f=n.n(l);function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var b=n(7),v=n.n(b),y=n(8),x=function(t){var e,n;function r(){return t.apply(this,arguments)||this}n=t,(e=r).prototype=Object.create(n.prototype),e.prototype.constructor=e,h(e,n);var a=r.prototype;return a.head=function(){var e=t.prototype.head.call(this);return e.add("title",m("th","Title"),20),e.add("price",m("th","Price"),10),e},a.columns=function(e){var n=t.prototype.columns.call(this,e);return n.add("title",m("td",m("input.FormControl",{type:"text",value:e.title()})),20),n.add("price",m("td",m("input.FormControl",{type:"number",value:e.price()})),10),n},a.actions=function(e){var n=t.prototype.actions.call(this,e);return n.add("edit",v.a.component({className:"Button Button--icon",icon:"fas fa-pen",href:app.route.product(e)})),n},r}(n.n(y).a),g={"components/ProductVariantList":x};app.initializers.add("flamarkt-variants",(function(){Object(u.extend)(a.a.prototype,"head",(function(t){t.add("balance",m("th","Variants"))})),Object(u.extend)(a.a.prototype,"columns",(function(t,e){t.add("balance",m("td",e.attribute("isVariantMaster")?"Yes":"No"))})),Object(u.extend)(i.a.prototype,"oninit",(function(){this.variantChildrenAttached=!0})),Object(u.extend)(i.a.prototype,"show",(function(){this.isVariantMaster=this.product.attribute("isVariantMaster"),this.variantProductListState=new s.a({filter:{variantOf:this.product.id()}}),this.product.attribute("isVariantMaster")&&this.variantProductListState.refresh()})),Object(u.extend)(i.a.prototype,"fields",(function(t){var e=this;this.product.attribute("isVariantChild")?t.add("variant-child-toggle",m(".Form-group",[m("label","Variant Child"),f.a.component({state:this.variantChildrenAttached,onchange:function(t){e.variantChildrenAttached=t,e.dirty=!0}},"Attached as child")])):t.add("variant-master-toggle",m(".Form-group",[m("label","Variant Master"),f.a.component({state:this.isVariantMaster,onchange:function(t){e.isVariantMaster=t,e.dirty=!0}},"Make into master")])),this.product.attribute("isVariantMaster")&&t.add("variants",m(".Form-group",[m("label","Variants"),m(x,{state:this.variantProductListState}),d.a.component({onclick:function(){app.store.createRecord("flamarkt-products").save({relationships:{variantMaster:e.product}}).then((function(t){e.variantProductListState.add(t),m.redraw()}))}},"Add"),d.a.component({onclick:function(){e.variantProductListState.refresh()}},"Refresh")]),-10)})),Object(u.extend)(i.a.prototype,"data",(function(t){t.isVariantMaster=this.isVariantMaster,this.variantChildrenAttached||(t.relationships=t.relationships||{},t.relationships.variantMaster=null)}))}))}]);
//# sourceMappingURL=backoffice.js.map