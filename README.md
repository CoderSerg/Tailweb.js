# Tailweb

A lightweight UI framework you can drop into any website via the DevTools console. Loads Tailwind CSS automatically — no setup needed.

---

## Quick Start

Paste `tailweb.js` into the DevTools console. Can't use bookmarklets due to `Content Security Policy`.

Once loaded, `tailweb` is available on `window`.

---

## Window

Creates a draggable, resizable window. Everything else goes inside it.

```js
const win = tailweb.Window({
  title,
  tailwindAccentColor,
  key,
  getKey
})
```

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | string | `"Tailweb"` | Title shown in the window header |
| `tailwindAccentColor` | string | `"gray-500"` | Accent color — Tailwind name or hex string — optional|
| `key` | string | — | Locks window behind a key screen on load — optional|
| `getKey` | function | — | Called when "Get Key" is clicked on the key screen — optional|

**Accent colors:** `gray-500` `blue-500` `red-500` `green-500` `purple-500` `yellow-500` `pink-500` `orange-500` `cyan-500` `indigo-500` `teal-500` `violet-500` or any hex like `"#ff6b6b"`

```js
const win = tailweb.Window({
  title: "My Hub",
  tailwindAccentColor: "violet-500",
  key: "mysecretkey123",
  getKey: () => window.open("https://yoursite.com/getkey")
})
```

---

## Button

```js
win.Button({
  title,
  callback,
  icon,
  iconColor
})
```

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | string | `"Button"` | Text on the button |
| `callback` | function | — | Called when clicked — optional|
| `icon` | string | — | Lucide icon name e.g. `"trash-2"` — optional|
| `iconColor` | string | `"#ffffff"` | Icon color — Tailwind name or hex — optional|

```js
win.Button({ title: "Save", icon: "save", callback: () => console.log("saved") })
win.Button({ title: "Delete", icon: "trash-2", iconColor: "red-500", callback: () => {} })
```

---

## Label

```js
win.Label({
  title,
  size,
  icon,
  iconColor
})
```

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | string | `""` | Text content |
| `size` | number | `11` | Font size in px — optional|
| `icon` | string | — | Lucide icon name — optional|
| `iconColor` | string | `"#ffffff"` | Icon color — Tailwind name or hex — optional|

```js
win.Label({ title: "Info", size: 13 })
win.Label({ title: "Settings", icon: "settings", size: 12 })
win.Label({ title: "Warning", icon: "triangle-alert", iconColor: "yellow-500" })
```

---

## TextBox

```js
win.TextBox({
  title,
  placeholder,
  variable,
  value,
  updateBlur
})
```

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | string | — | Label shown above the input |
| `placeholder` | string | `""` | Placeholder text — optional|
| `variable` | ref object | — | Ref object to bind value to — optional|
| `value` | string | `""` | Default pre-filled value — optional|
| `updateBlur` | boolean | `false` | `false` = live update, `true` = update on blur — optional|

**Variable binding** — JS primitives can't be passed by reference, use a ref object:

```js
const myVar = { __tailwebRef: { value: "" } }

win.TextBox({ title: "Name", variable: myVar })

console.log(myVar.__tailwebRef.value) // read the current value
```

---

## Key

Binds a keyboard key to toggle the window's visibility.

```js
win.Key({ key })
```

| Property | Type | Description |
|---|---|---|
| `key` | string | Any valid [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) value |

```js
win.Key({ key: "F2" })
win.Key({ key: "`" })
```

---

## Lock

Re-locks the window and shows the key screen again. Does nothing if no `key` was set or already locked.

```js
win.Lock()
```

---

## Remove

Destroys the window. `tailweb` itself stays available.

```js
win.Remove()
```

---

## Popup

Shows a centered modal with a dark overlay. Accent color is pulled from a random existing window.

```js
tailweb.Popup({
  title,
  description,
  icon,
  button1,
  button2,
  button3,
  cbutton1,
  cbutton2,
  cbutton3
})
```

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | string | — | Popup title |
| `description` | string | — | Body text below the title — optional|
| `icon` | string | — | Lucide icon shown on `button1` — optional|
| `button1` | string | — | Primary button (accent-tinted) |
| `button2` | string | `"Cancel"` | If omitted, auto-adds a Cancel button that closes the popup — optional|
| `button3` | string | — | Third button — optional|
| `cbutton1` | function | — | Called when `button1` is clicked — optional|
| `cbutton2` | function | — | Called when `button2` is clicked — optional|
| `cbutton3` | function | — | Called when `button3` is clicked — optional|

Buttons render right-to-left: `button3`, `button2`/Cancel, `button1`.

```js
// Simple confirm
tailweb.Popup({
  title: "Are you sure?",
  description: "This can't be undone.",
  button1: "Continue",
  icon: "arrow-right",
  cbutton1: () => console.log("confirmed")
})

// Three buttons
tailweb.Popup({
  title: "Save changes?",
  button1: "Save",
  button2: "Discard",
  button3: "Cancel",
  cbutton1: () => console.log("saved"),
  cbutton2: () => console.log("discarded")
})
```

---

## Notify

Shows a toast notification in the bottom right. Accent color is pulled from a random existing window. The progress bar at the bottom shrinks right to left over the duration.

```js
tailweb.Notify({
  title,
  description,
  icon,
  time
})
```

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | string | — | Notification title |
| `description` | string | — | Body text below the title — optional|
| `icon` | string | — | Lucide icon name, shown at 32px — optional|
| `time` | number | `3` | Seconds before auto-dismiss — optional|

```js
tailweb.Notify({
  title: "Saved",
  description: "Your changes were saved.",
  icon: "check-circle",
  time: 4
})
```

---

## Key Screen

When `key` is set on a window, a key screen overlays it on load.

| Button | Description |
|---|---|
| Exit | Removes the window |
| Get Key | Only shown if `getKey` is provided |
| Submit | Correct key dismisses screen, wrong key flashes red |

---

## Icons

`Button`, `Label`, `Popup` (`button1` only), and `Notify` support [Lucide](https://lucide.dev/icons/) icons — fetched automatically, no setup needed. Icons appear to the left of text and match the element's font size.

---

## Chaining

All element methods return the window so you can chain:

```js
tailweb.Window({ title: "Toolbox", tailwindAccentColor: "violet-500" })
  .Label({ title: "Config", icon: "settings" })
  .TextBox({ title: "API Key", placeholder: "sk-..." })
  .Button({ title: "Submit", icon: "check", callback: () => {} })
  .Key({ key: "F1" })
```

---

## Full Example

```js
const nameRef = { __tailwebRef: { value: "" } }

const win = tailweb.Window({
  title: "My Hub",
  tailwindAccentColor: "cyan-500",
  key: "letmein",
  getKey: () => window.open("https://yoursite.com/getkey")
})

win.Label({ title: "Enter your info", icon: "clipboard", size: 11 })
win.TextBox({ title: "Name", placeholder: "John Doe", variable: nameRef })
win.Button({
  title: "Submit",
  icon: "check",
  callback: () => {
    tailweb.Popup({
      title: "Submitted!",
      description: "Name: " + nameRef.__tailwebRef.value,
      button1: "OK",
      cbutton1: () => {
        win.Remove()
        tailweb.Notify({ title: "Done", icon: "check-circle", time: 2 })
      }
    })
  }
})
win.Button({ title: "Lock", icon: "lock", callback: () => win.Lock() })
win.Key({ key: "F2" })
```