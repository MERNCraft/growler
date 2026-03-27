# Growl #

React Context, Component and Routes hierarchy with Outlet, to demonstrate a custom message growler system.

[Demo](https://merncraft.github.io/growler/?#/)

Run `npm i` to install Node modules.

This demo uses GrowlContext to relay the latest growl to the Growler component.

To demonstrate that growl messages will be visible over any other components, `react-router-dom` is used to create two different routes.
The Growler component is added to a Frame component, which acts as a parent for all routes. The Frame hosts an Outlet for all other routes, with Growler in a layer about them.

You don't need to use `react-router-dom` if your project does not require it. Just make sure that `<Growler />` is the last component mounted in the component tree.

## Markup and links in a Growl

This demo uses [DOMPurify](https://www.npmjs.com/package/dompurify) to sanitize any HTML that you might want to include in a growl message. This means that you can add HTML markup and links to your growls.

## Running code from a Growl

However, DOMPurify will remove any active code from a plain HTML string. If running code from a growl is important for you, create your own `message`s with a format like `{ __html: "<h1>Your HTML goes here</h1>" }. If the HTML is well-formatted, the GrowlerComponent will know how to deal with this. The Create Dangerous Growl gives you an example of this.

**NOTE: In the online demo on GitHub, this may fail, unless you use [this link](https://merncraft.github.io/growler/?#/)**

## Forcing a Growl to close

The list of Close Growl buttons is for demonstration purposes only. The GrowlContext does not keep track of growls that have been created or closed, so there is no way for its clients to keep track of which growls are still open.

You can think of the value returned from `newGrowl()` as being like the value returned by `setTimeout()`; if you don't keep track of it manually, it is destroyed automatically. Calling `clearTimeout()` with the index of a timeout that has already fired has no effect.

In the same way, calling `closeGrowl()` with the index of a growl that has already closed has no effect.

## CSS

This demo uses the `div#growls` entry in `src/main.css` to style the growl elements. It's good to ensure that the elements have a quite opaque background. In this demo, growls with a delay > 5 seconds have been given a reddish background-color, and those with a delay of 0 have been given a darker red background-color. You can customize these settings here:

```css

div#growls {
  --border: #f90;
  --dark: #222d;
  --long: #200d;
  --high: #400d;

/* Skipping to the end */

  p:has(button) {
    background-color: var(--long);

    & button {
      background-color: var(--long);
    }
  }

  p[data-delay="0"] {
    background-color: var(--high);

    & button {
      background-color: var(--high);
    }
  }
}
```

## Very long growl messages

Growl messages that are very long will show a vertical scroll bar, but it's possible that the top of such a message will appear clipped.
