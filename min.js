self.idroscalo=function(e){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}
/*! (c) Andrea Giammarchi - ISC */var r=Array.isArray,n=Object.keys;return e.hydrate=function(e,o,a){var c=new Map,i=new WeakMap,s=[],u=0,l=function(){u||(u=setTimeout(f,0))},f=function(){u=0,y();for(var a=n(o),l=0,f=a.length;l<f;l++)for(var v=a[l],p=o[v],b=e.querySelectorAll(v),h=0,m=b.length;h<m;h++)for(var d=b[h],g=n(p),S=0,w=g.length;S<w;S++){var M=g[S],k=p[M];if("^"!==M){var A=r(k),L=[M].concat(A?k:[k,!1]);if(A&&"object"===t(L[2])&&L[2].once){var T=i.get(d);if(T||i.set(d,T=new Set),T.has(L[1]))continue;T.add(L[1])}d.addEventListener.apply(d,L),i.has(d)||s.push({e:d,a:L})}else{var j=c.get(v);j||c.set(v,j=new WeakMap),j.has(d)||(j.set(d,0),k({currentTarget:d,target:d,selector:v}))}}},y=function(){for(var e=s.splice(0),t=0,r=e.length;t<r;t++){var n=e[t],o=n.e,a=n.a;o.removeEventListener.apply(o,a)}},v={subtree:!0,childList:!0};for(var p in a)v[p]=a;var b=new MutationObserver(l),h=b.disconnect;return b.observe(e,v),b.disconnect=function(){return clearTimeout(u),y(),c.clear(),h.call(b)},l(),b},e.init="^",e}({});