Accessibility or commonly shorted **a11y** is a set of guidelines and tools to make the web usable for everybody no matter disabilities.

HTML is semantic and its elements can be implemented in an accessible way by every browser. You've probably noticed that `select` elements (dropdowns) look different in your smartphone than on your desktop computer. It's the same element in both cases but the browser decides to serve a better suited UI on the smartphone. Similar adjustments can be made in the browser to help people with different disabilities. However when we don't use native elements but instead implement our own interactive components, we need to make sure that we deliver information to the browser so that it's still able to make good decisions and provide context for users. The megamenu, flyouts, and modals are some examples of components that need special care in order to provide a good accessibility experience.

Nitro has good support for accessibility out of the box, with tools and techniques that can be used to tailor it for customer specific needs.

> Also see [Avensia-Accessibility-Best-Practice](https://avensiaab.sharepoint.com/sites/BUCommerce/SitePages/Avensia-Accessibility-Best-Practice.aspx?e=NbGwzv) on Sharepoint!

## Visible focus selector

By default browsers show an outline on focused element which is necessary for a11y. However this will show even when you click on elements and customers dislike that. A newer CSS selector `:focus-visible` will allow you to only target tabbing focus. Until that selector has better support we will in Nitro provide a Higher Order Component (HOC), the [TabFocus](https://github.com/avensia/nitro/blob/develop/src/Avensia.Common/Features/Shared/a11y/TabFocus.tsx) component, to enhance our focusable components with the same behavior.

> Use the `TabFocus` component to create a visible focus selector on your components

To use it:
```js
import { createTabbingFocusElement } from 'Shared/a11y/TabFocus';
const MyComponentWithVisualTabFocus = createTabbingFocusElement(MyComponent);
```

There are two HOCs.

- `createTabbingFocusElement()` - The outmost element is the focusable element.
  Example: `<button>hit me</button>`

- `createTabbingFocusWithinElement()` - The focusable element is a child to the outmost element. Example would be `<label><input type="checkbox" /></label>` where `label` is the element that the style is applied on but `input` is the element that is focusable.

You'll find the `TabFocus` component here: [`Features\Shared\a11y\TabFocus.tsx`](https://github.com/avensia/nitro/blob/develop/src/Avensia.Common/Features/Shared/a11y/TabFocus.tsx)

## Tab index

Elements should be laid out in the DOM in the order you want them to be tabbable. Try to avoid specifying explicit tab indexes as this is likely to break when a new element is introduced. All buttons, input elements and links are by default tabbable. Use `tab-index="-1"` if you want to prevent an element from getting tab focus.

## Tab trap

When a user opens the mega menu, a modal or flyout you want the user to only navigate between the elements inside that component. This is called a tab trap. We deal with this by setting focus on the first focusable element within the tab trap when it's enabled. When tabbing through and reaching the last element we will circulate to the first element again.

> Use `TabTrap` to restrict tabbing to elements inside a component

To use TabTrap you simply wrap your tabbable elements in the tab trap component and set the enable prop. Example:

```html
<TabTrap enable={isModalOpen}><ModalChildElements /></TabTrap>
```

You'll find the `TabTrap` component here: [`Features\Shared\a11y\TabTrap.tsx`](https://github.com/avensia/nitro/blob/develop/src/Avensia.Common/Features/Shared/a11y/TabTrap.tsx)

## Skip to content

Keyboard users and screen readers needs to step through every tabbable element until they reach their desired element. It can be quite cumbersome to step through all elements in the header after every page load in order to reach the content on the loaded page.

A nice way to help them with this is to implement "Skip to X" buttons. These are visually hidden until focused so they can never be seen by a pure mouse or touch interactive user. When the user presses on such button it will shift focus to a focusable element of you choice. As an example we have implemented a "Skip to content" button as the first element in the header that when pressed will shift focus to the first focusable element on currentPage.

For an example of how this implemented, see: [`Features\SiteLayout\index.tsx`](https://github.com/avensia/nitro/blob/develop/src/Avensia.Common/Features/SiteLayout/index.tsx)

## Alt texts

Alt texts on images has several purposes.

- Screen reader users can't see images but alt text can give them some context.
- Image may not load and alt text gives info about what user is missing out on.
- Search engines may index images bases on alt texts.

An informative alt-text describes what is shown in the image. An example would be "A man in white shirt sitting behind a desk and looking worried".

In Nitro, all product images will have automatic alt texts set, based on the product name. For content images (like `ImageBlock`) the editor can provide the alt text.

> Guide your customer so all CMS editors are aware alt-texts are important!

## Aria

In many cases we provide graphical elements that gives no information to a screen reader.

Example:
```html
<button onClick={openMiniCartFunction}><CartIcon></button>
```

Here we provide no meta data to the screen reader to understand what this button does. This is where `aria-label` plays a role. It should provide a label that describes the element. If we update the example above it could look like this

```html
<button aria-label="open minicart" onClick={openMiniCartFunction}><CartIcon></button>
```

> Use `aria-label` to describe what a button does

A visual user will be able to see if our mini cart actually is open or if it's closed. You can help a screen reader out with this as well by adding `aria-expanded`.

> Use `aria-expanded` to describe if an element is open or closed

Our finished implementation can look like this.

```html
<button
    aria-label="open minicart"
    aria-expanded={isMiniCartOpen}
    onClick={openMiniCartFunction}
>
    <CartIcon>
</button>
```

## Off-screen elements and invisible elements
Don't keep focusable elements in the DOM when they are not visible. An example would be a flyout that we close by applying a CSS transform but doesn't unmount the children when closed. User will have to tab through these elements without seeing them.

There are two ways to approach this, either set tab index to -1 when elements are invisible - or unmount them altogether.

For an example of the latter, see [Features/Shared/Flyout/index.tsx](https://github.com/avensia/nitro/blob/develop/src/Avensia.Common/Features/Shared/Flyout/index.tsx)

## Other useful tips and mindsets

- Prefer usage of native HTML elements if possible and enhance them to your liking. Think of the escalator as an enhanced staircase. When the escalator is broken it still does serve a great purpose.