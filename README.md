# Tailweb

A lightweight UI framework you can drop into any website via the browser console or a bookmarklet. Loads Tailwind CSS automatically — no build step, no setup.

---

## Quick Start

Paste `tailweb.js` into DevTools console, that's it. You can't eval or inject it via a bookmarklet because of `Content Security Policy`.

Once loaded, `tailweb` is available on `window`.

---

## `tailweb.Window(options)`

Creates a draggable, resizable window. All elements are added to it.

### Syntax

```js
const win = tailweb.Window({
  title,
  tailwindAccentColor,
  key,
  getKey
})
```

### Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"Tailweb"` | Title shown in the window header |
| || `tailwindAccentColor` | `string` | `"gray-500"` | Accent color — Tailwind name or hex string |
| || `key` | `string` | — | If set, shows a key screen on load. Window is locked until the correct key is entered |
| || `getKey` | `function` | — | Called when the user clicks "Get Key" on the key screen |

### Supported accent color names

`gray-500` `blue-500` `red-500` `green-500` `purple-500` `yellow-500` `pink-500` `orange-500` `cyan-500` `indigo-500` `teal-500` `violet-500`

Or pass any hex string directly: `"#ff6b6b"`

### Example

```js
const win = tailweb.Window({
  title: "My Hub",
  tailwindAccentColor: "violet-500",
  key: "mysecretkey123",
  getKey: () => window.open("https://yoursite.com/getkey")
})
```

---

## `win.Button(options)`

Adds a clickable button to the window.

### Syntax

```js
win.Button({
  title,
  callback,
  icon,
  iconColor
})
```

### Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"Button"` | Text displayed on the button |
| || `callback` | `function` | — | Function called when button is clicked |
| || `icon` | `string` | — | Any valid [Lucide](https://lucide.dev/icons/) icon name e.g. `"trash-2"` |
| || `iconColor` | `string` | `"#ffffff"` | Icon color — Tailwind name or hex string. Defaults to white |

### Example

```js
win.Button({
  title: "Say Hello",
  callback: () => console.log("hello")
})

win.Button({
  title: "Delete",
  icon: "trash-2",
  iconColor: "red-500",
  callback: () => console.log("deleted")
})
```

---

## `win.Label(options)`

Adds a static text label to the window.

### Syntax

```js
win.Label({
  title,
  size,
  icon,
  iconColor
})
```

### Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `""` | Text content of the label |
| || `size` | `number` | `10` | Font size in pixels |
| || `icon` | `string` | — | Any valid [Lucide](https://lucide.dev/icons/) icon name e.g. `"settings"` |
| || `iconColor` | `string` | `"#ffffff"` | Icon color — Tailwind name or hex string. Defaults to white |

### Example

```js
win.Label({ title: "Current session info", size: 13 })
win.Label({ title: "Settings", icon: "settings", size: 12 })
win.Label({ title: "Warning", icon: "triangle-alert", iconColor: "yellow-500", size: 11 })
```

---

## `win.TextBox(options)`

Adds a text input to the window. Can bind to a ref object and update it live or on blur.

### Syntax

```js
win.TextBox({
  title,
  placeholder,
  variable,
  value,
  updateBlur
})
```

### Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Small label shown above the input |
| || `placeholder` | `string` | `""` | Placeholder text inside the input |
| || `variable` | `ref object` | — | Ref object to bind the value to (see below) |
| || `value` | `string` | `""` | Default value pre-filled in the input |
| || `updateBlur` | `boolean` | `false` | `false` = updates on every keystroke, `true` = updates only on blur |

### Variable binding

JS primitives can't be passed by reference, so use a ref object:

```js
const myVar = { __tailwebRef: { value: "" } }

win.TextBox({
  title: "Username",
  variable: myVar,
  updateBlur: false
})

// Access the current value:
console.log(myVar.__tailwebRef.value)
```

### Example

```js
const query = { __tailwebRef: { value: "" } }

win.TextBox({
  title: "Search",
  placeholder: "Type to search...",
  variable: query,
  value: "default text",
  updateBlur: true
})
```

---

## `win.Key(options)`

Binds a keyboard key to toggle the window's visibility.

### Syntax

```js
win.Key({ key })
```

### Properties

| Property | Type | Description |
|---|---|---|
| `key` | `string` | Any valid [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) value |

### Example

```js
win.Key({ key: "F2" })
win.Key({ key: "`" })
win.Key({ key: "Escape" })
```

---

## `win.Lock()`

Re-shows the key screen, locking the window until the correct key is entered again. Does nothing if no key system was set up on the window or if already locked.

### Syntax

```js
win.Lock()
```

### Example

```js
win.Button({
  title: "Lock",
  callback: () => win.Lock()
})
```

---

## `win.Remove()`

Destroys the window and all its elements. `tailweb` itself stays available.

### Syntax

```js
win.Remove()
```

### Example

```js
win.Button({
  title: "Close Window",
  callback: () => win.Remove()
})
```

---

## Key Screen

When `key` is passed to `tailweb.Window()`, a key screen overlays the window on load. It has three buttons:

| Button | Description |
|---|---|
| Exit | Removes the window entirely |
| Get Key | Only shown if `getKey` is provided. Calls the function you passed |
| Submit | Validates the entered key — dismisses the screen if correct, flashes red if wrong |

All key screen elements follow the window's accent color.

---

## Icons

`Button` and `Label` support icons via the [Lucide](https://lucide.dev/icons/) icon library, fetched automatically — no extra setup needed.

- Icons render to the left of the text
- Size matches the element's font size
- Default color is white unless `iconColor` is set
- `iconColor` accepts the same Tailwind names or hex strings as `tailwindAccentColor`

---

## Chaining

All element methods return the window instance, so you can chain:

```js
const win = tailweb.Window({ title: "Toolbox", tailwindAccentColor: "violet-500" })

win
  .Label({ title: "Config", icon: "settings", size: 12 })
  .TextBox({ title: "API Key", placeholder: "sk-...", updateBlur: true })
  .Button({ title: "Submit", icon: "check", callback: () => console.log("submitted") })
  .Key({ key: "F1" })
```

---

## Full Example

```js
const nameRef = { __tailwebRef: { value: "" } }
const emailRef = { __tailwebRef: { value: "" } }

const win = tailweb.Window({
  title: "My Hub",
  tailwindAccentColor: "cyan-500",
  key: "letmein",
  getKey: () => window.open("https://yoursite.com/getkey")
})

win.Label({ title: "Fill out the form below", icon: "clipboard", size: 11 })

win.TextBox({
  title: "Name",
  placeholder: "John Doe",
  variable: nameRef,
  updateBlur: false
})

win.TextBox({
  title: "Email",
  placeholder: "john@example.com",
  variable: emailRef,
  updateBlur: true
})

win.Button({
  title: "Submit",
  icon: "check",
  callback: () => {
    console.log("Name:", nameRef.__tailwebRef.value)
    console.log("Email:", emailRef.__tailwebRef.value)
  }
})

win.Button({
  title: "Lock",
  icon: "lock",
  callback: () => win.Lock()
})

win.Button({
  title: "Close",
  icon: "x",
  iconColor: "red-500",
  callback: () => win.Remove()
})

win.Key({ key: "F2" })
```