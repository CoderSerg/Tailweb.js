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
  title,                  // string
  tailwindAccentColor,    // || string, default: "gray-500"
  key,                    // || string, locks window behind a key screen
  getKey                  // || function, called when "Get Key" is clicked
})
```

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
  title,       // string
  callback,    // || function
  icon,        // || string, Lucide icon name e.g. "trash-2"
  iconColor    // || string, Tailwind name or hex, default: white
})
```

```js
win.Button({ title: "Save", icon: "save", callback: () => console.log("saved") })
win.Button({ title: "Delete", icon: "trash-2", iconColor: "red-500", callback: () => {} })
```

---

## Label

```js
win.Label({
  title,       // string
  size,        // || number, font size in px, default: 11
  icon,        // || string, Lucide icon name
  iconColor    // || string, Tailwind name or hex, default: white
})
```

```js
win.Label({ title: "Info", size: 13 })
win.Label({ title: "Settings", icon: "settings", size: 12 })
win.Label({ title: "Warning", icon: "triangle-alert", iconColor: "yellow-500" })
```

---

## TextBox

```js
win.TextBox({
  title,        // string
  placeholder,  // || string
  variable,     // || ref object (see below)
  value,        // || string, default value
  updateBlur    // || boolean, false = live update, true = update on blur
})
```

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
win.Key({ key }) // any KeyboardEvent.key value
```

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
  title,        // string
  description,  // || string
  icon,         // || string, Lucide icon on button1
  button1,      // string, primary button
  button2,      // || string, if omitted auto-adds a "Cancel" button
  button3,      // || string
  cbutton1,     // || function
  cbutton2,     // || function
  cbutton3      // || function
})
```

- Buttons render right-to-left: `button3`, `button2`/Cancel, `button1`
- `button1` is the primary (accent-tinted) button
- If only `button1` is set, a "Cancel" button is added automatically that closes the popup
- `cbutton` callbacks only fire if their corresponding button is defined

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

## Key Screen

When `key` is set on a window, a key screen overlays it on load.

| Button | Description |
|---|---|
| Exit | Removes the window |
| Get Key | Only shown if `getKey` is provided |
| Submit | Correct key dismisses screen, wrong key flashes red |

---

## Icons

`Button`, `Label`, and `Popup` (`button1` only) support [Lucide](https://lucide.dev/icons/) icons — fetched automatically, no setup needed. Icons appear to the left of text and match the element's font size.

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
      cbutton1: () => win.Remove()
    })
  }
})
win.Button({ title: "Lock", icon: "lock", callback: () => win.Lock() })
win.Key({ key: "F2" })
```