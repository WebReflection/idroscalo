# idroscalo

[Idroscalo](https://en.wikipedia.org/wiki/Idroscalo) name plays with the words "*hydration*" and "*scale*", bringing in *~0.5K* everything it's needed to hydrate specific element within a `document`, or any other container.

```js
// 'idroscalo/modern' is a 0.1K smaller export
// but it doesn't work in IE11 or legacy Edge
import {hydrate, init} from 'idroscalo';

// returns the MutationObserver with a special
// disconnect behavior (described later on)
// hydrate(root:Node, {...selectors}[, {...overrides}]):MutationObserver
const mo = hydrate(document, {

  // one or more CSS selectors
  '.specific-element': {

    // if specified, the init key is invoked when new
    // elements matching the selector are found
    [init]({target, selector}) {
      // selector here will be '.specific-element'
      // target is the element that is being initiated
      // this callback happens only *once* per element
      target.textContent = 'idroscalo';
    },

    // every other property will be attached as listener
    click({target}) {
      // by default, events are attached with options = false
      alert(`You clicked ${target.localName}`);
    },

    // if passed as Array, it is possible to specify options too
    mouseover: [
      ({target}) => {
        console.log(`hovered ${target.localName}`);
      },
      // every option can be passed around,
      // including `true` for capturing
      {once: true}
    ]
  },

  // selectors could be grouped too
  [['#special', '#popup']]: {
    click() {}
  }

  // an optional overrides object can be passed
  // by default, options is {subtree: true, childList: tree}
  // pass {attributes: true} with optional filters in case
  // selectors want to observe attributes changes as well
});

// if invoked, all listeners will be dropped *except*
// those attached as `{once: true}`, in case these
// haven't triggered already before.
mo.disconnect();
```

Differently from [element-notifier](https://github.com/WebReflection/element-notifier#readme) and [qsa-observer](https://github.com/WebReflection/qsa-observer#readme), this module goal is only to hydrate listeners and, optionally, initialize some element, without needing to care at all about elements lifecycle.

If you need anything fancier, you could also consider [wicked-elements](https://github.com/WebReflection/wicked-elements#readme), which is just twice as big, but it has more features, in terms of components behavior.
