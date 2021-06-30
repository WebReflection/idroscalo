/*! (c) Andrea Giammarchi - ISC */

const {isArray} = Array;
const {assign, keys} = Object;

export const init = '^';

/**
 * Attach a MutationObserver to a document/element and add listeners
 * when CSS selectors specified as `targets` are added to the `root` tree.
 * It removes all live/known listeners when `disconnect` is invoked.
 * @param root {Node} where to observe changes
 * @param targets {object} a list of key/value pairs as CSS selector
 * @param overrides {object?} MutationObserver setup overrides
 * @returns {MutationObserver}
 */
export const hydrate = (root, targets, overrides) => {
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
    for (const selector of keys(targets)) {
      const target = targets[selector];
      for (const element of root.querySelectorAll(selector)) {
        for (const type of keys(target)) {
          const info = target[type];
          if (type === init) {
            let initiated = initiator.get(selector);
            if (!initiated)
              initiator.set(selector, initiated = new WeakSet);
            if (!initiated.has(element)) {
              initiated.add(element);
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
    for (const {e, a} of listeners.splice(0))
      e.removeEventListener.apply(e, a);
  };

  const mo = new MutationObserver(observer);
  const {disconnect: drop} = mo;
  mo.observe(root, assign({subtree: true, childList: true}, overrides));
  mo.disconnect = function disconnect() {
    clearTimeout(i);
    cleanup();
    initiator.clear();
    return drop.call(mo);
  };

  observer();

  return mo;
};
