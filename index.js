self.idroscalo = (function (exports) {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /*! (c) Andrea Giammarchi - ISC */
  var isArray = Array.isArray;
  var keys = Object.keys;
  var init = '^';
  /**
   * Attach a MutationObserver to a document/element and add listeners
   * when CSS selectors specified as `targets` are added to the `root` tree.
   * It removes all live/known listeners when `disconnect` is invoked.
   * @param root {Node} where to observe changes
   * @param targets {object} a list of key/value pairs as CSS selector
   * @param overrides {object?} MutationObserver setup overrides
   * @returns {MutationObserver}
   */

  var hydrate = function hydrate(root, targets, overrides) {
    var initiator = new Map();
    var once = new WeakMap();
    var listeners = [];
    var i = 0;

    var observer = function observer() {
      if (!i) i = setTimeout(setup, 0);
    };

    var setup = function setup() {
      i = 0;
      cleanup();

      for (var selectors = keys(targets), s = 0, length = selectors.length; s < length; s++) {
        for (var selector = selectors[s], target = targets[selector], elements = root.querySelectorAll(selector), e = 0, _length = elements.length; e < _length; e++) {
          for (var element = elements[e], types = keys(target), t = 0, _length2 = types.length; t < _length2; t++) {
            var type = types[t];
            var info = target[type];

            if (type === init) {
              var initiated = initiator.get(selector);
              if (!initiated) initiator.set(selector, initiated = new WeakMap());

              if (!initiated.has(element)) {
                initiated.set(element, 0);
                info({
                  currentTarget: element,
                  target: element,
                  selector: selector
                });
              }

              continue;
            }

            var asArray = isArray(info);
            var args = [type].concat(asArray ? info : [info, false]);

            if (asArray) {
              if (_typeof(args[2]) === 'object' && args[2].once) {
                var set = once.get(element);
                if (!set) once.set(element, set = new Set());
                if (set.has(args[1])) continue;
                set.add(args[1]);
              }
            }

            element.addEventListener.apply(element, args);
            if (!once.has(element)) listeners.push({
              e: element,
              a: args
            });
          }
        }
      }
    };

    var cleanup = function cleanup() {
      for (var previous = listeners.splice(0), p = 0, length = previous.length; p < length; p++) {
        var _previous$p = previous[p],
            e = _previous$p.e,
            a = _previous$p.a;
        e.removeEventListener.apply(e, a);
      }
    };

    var options = {
      subtree: true,
      childList: true
    };

    for (var key in overrides) {
      options[key] = overrides;
    }

    var mo = new MutationObserver(observer);
    var drop = mo.disconnect;
    mo.observe(root, options);

    mo.disconnect = function disconnect() {
      clearTimeout(i);
      cleanup();
      initiator.clear();
      return drop.call(mo);
    };

    observer();
    return mo;
  };

  exports.hydrate = hydrate;
  exports.init = init;

  return exports;

}({}));
