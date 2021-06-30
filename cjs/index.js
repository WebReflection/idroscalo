'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {isArray} = Array;
const {keys} = Object;

const init = '^';
exports.init = init;

/**
 * Attach a MutationObserver to a document/element and add listeners
 * when CSS selectors specified as `targets` are added to the `root` tree.
 * It removes all live/known listeners when `disconnect` is invoked.
 * @param root {Node} where to observe changes
 * @param targets {object} a list of key/value pairs as CSS selector
 * @param overrides {object?} MutationObserver setup overrides
 * @returns {MutationObserver}
 */
const hydrate = (root, targets, overrides) => {
  const initiator = new Map;
  const once = new WeakMap;
  const listeners = [];

  let i = 0;

  const observer = () => {
    if (!i)
      i = setTimeout(setup, 0);
  };

  const setup = () => {
    i = 0;
    cleanup();
    for (let
      selectors = keys(targets),
      s = 0, {length} = selectors; s < length; s++
    ) {
      for (let
        selector = selectors[s],
        target = targets[selector],
        elements = root.querySelectorAll(selector),
        e = 0, {length} = elements; e < length; e++
      ) {
        for (let
          element = elements[e],
          types = keys(target),
          t = 0, {length} = types; t < length; t++
        ) {
          const type = types[t];
          const info = target[type];
          if (type === init) {
            let initiated = initiator.get(selector);
            if (!initiated)
              initiator.set(selector, initiated = new WeakMap);
            if (!initiated.has(element)) {
              initiated.set(element, 0);
              info({currentTarget: element, target: element, selector});
            }
            continue;
          }
          const asArray = isArray(info);
          const args = [type].concat(asArray ? info : [info, false]);
          if (asArray) {
            if (typeof args[2] === 'object' && args[2].once) {
              let set = once.get(element);
              if (!set)
                once.set(element, set = new Set);
              if (set.has(args[1]))
                continue;
              set.add(args[1]);
            }
          }
          element.addEventListener.apply(element, args);
          if (!once.has(element))
            listeners.push({e: element, a: args});
        }
      }
    }
  };

  const cleanup = () => {
    for (let
      previous = listeners.splice(0),
      p = 0, {length} = previous; p < length; p++
    ) {
      const {e, a} = previous[p];
      e.removeEventListener.apply(e, a);
    }
  };

  const options = {
    subtree: true,
    childList: true
  };

  for (const key in overrides)
    options[key] = overrides;

  const mo = new MutationObserver(observer);
  const {disconnect: drop} = mo;
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
