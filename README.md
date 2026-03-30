# Growl #

React Context, Component and Routes hierarchy with Outlet, to demonstrate a custom message growler system.

[Demo](https://merncraft.github.io/growler/?#/)

Run `npm i` to install Node modules.

This demo uses GrowlContext to store active growls which are rendered by the Growler component.

## Preview environment
A sophisticated preview environment is used, to demonstrate the robustness of the Growl feature. Your projects can use a simpler environment.

1. To demonstrate that growl messages will be visible over any other components, `react-router-dom` is used to create two different routes. The Growler component is added to a Frame component, which acts as a parent for all routes. The Frame hosts an Outlet for all other routes, with Growler in a layer about them.

2. To demonstrate that the growl messages will be maintained even if the Growler component is remounted, the Force Remount button will create a new (but identical) `<Routes>` component, and all its children will be remounted, including `<Growler>`.

You don't need to use `react-router-dom` if your project does not require it. Just make sure that `<Growler />` is the last component mounted in the component tree.

## Markup and links in a Growl

This demo uses [DOMPurify](https://www.npmjs.com/package/dompurify) to sanitize any HTML that you might want to include in a growl message. This means that you can add HTML markup and links to your growls, even from untrusted sources.

## Running code from a Growl

However, DOMPurify will remove any active code from a plain HTML string. If running code from a growl is important for you, create your own `message`s with a format like `{ __html: "<h1>Your HTML goes here</h1>" }. If the HTML is well-formatted, the GrowlerComponent will know how to deal with it. The Create Dangerous Growl button gives you an example of this.

**NOTE: In the online demo on GitHub, this may fail, unless you use [this link](https://merncraft.github.io/growler/?#/)**

## Forcing a Growl to close

The `newGrowl()` function returns a integer which increments at each call, just like `setTimeout()` and `setInterval()`. You can call `dismissGrowl(<growl integer>)` to force the given growl to close.

Growls that need to be manually dismissed will slide out as you might expect. Growls that are auto-dismissed will disappear immediately.

## CSS

This demo uses the `div#growls` entry in `src/growls.css` to style the growl elements. It's good to ensure that the elements have a quite opaque background. In this demo, growls with a delay > 5 seconds have been given a reddish background-color, and those with a delay of 0 have been given a darker red background-color. You can customize these settings here:

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
