(function (global) {
  const TAILWEB_CDN = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

  function loadTailwind() {
    if (document.querySelector('script[src="' + TAILWEB_CDN + '"]')) return;
    const s = document.createElement("script");
    s.src = TAILWEB_CDN;
    document.head.appendChild(s);
  }

  loadTailwind();

  function injectBaseStyles() {
    if (document.getElementById("tailweb-base")) return;
    const style = document.createElement("style");
    style.id = "tailweb-base";
    style.textContent = `
      .tailweb-window {
        font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
        position: fixed;
        z-index: 2147483647;
        min-width: 280px;
        max-width: 520px;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06);
        border-radius: 10px;
        overflow: hidden;
        resize: both;
        user-select: none;
      }
      .tailweb-titlebar { cursor: grab; }
      .tailweb-titlebar:active { cursor: grabbing; }
      .tailweb-content {
        user-select: text;
        overflow-y: auto;
        max-height: 70vh;
      }
      .tailweb-keyscreen {
        position: absolute;
        inset: 0;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        padding: 24px;
        background: #030712;
        border-radius: 10px;
      }
    `;
    document.head.appendChild(style);
  }

  injectBaseStyles();

  function makeDraggable(win, handle) {
    let ox = 0, oy = 0, mx = 0, my = 0;
    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      mx = e.clientX;
      my = e.clientY;
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    });
    function drag(e) {
      ox = mx - e.clientX;
      oy = my - e.clientY;
      mx = e.clientX;
      my = e.clientY;
      win.style.top = (win.offsetTop - oy) + "px";
      win.style.left = (win.offsetLeft - ox) + "px";
      win.style.right = "auto";
      win.style.bottom = "auto";
    }
    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }
  }

  const tailweb = {
    Window({ title, tailwindAccentColor, key: requiredKey, getKey } = {}) {
      const accent = tailwindAccentColor || "gray-500";
      const accentMap = {
        "gray-500": "#6b7280", "blue-500": "#3b82f6", "red-500": "#ef4444",
        "green-500": "#22c55e", "purple-500": "#a855f7", "yellow-500": "#eab308",
        "pink-500": "#ec4899", "orange-500": "#f97316", "cyan-500": "#06b6d4",
        "indigo-500": "#6366f1", "teal-500": "#14b8a6", "violet-500": "#8b5cf6",
      };
      const accentHex = accentMap[accent] || accent;

      const win = document.createElement("div");
      win.className = "tailweb-window";
      win.style.cssText = `background: #030712; border: 1px solid rgba(255,255,255,0.08); top: 60px; right: 24px; color: #fff;`;

      const titlebar = document.createElement("div");
      titlebar.className = "tailweb-titlebar";
      titlebar.style.cssText = `display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.07);`;

      const titleEl = document.createElement("span");
      titleEl.style.cssText = `font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${accentHex};`;
      titleEl.textContent = title || "Tailweb";

      const controls = document.createElement("div");
      controls.style.cssText = "display:flex;gap:6px;align-items:center;";

      const minimizeBtn = document.createElement("button");
      minimizeBtn.style.cssText = `width:10px;height:10px;border-radius:50%;background:#f59e0b;border:none;cursor:pointer;transition:opacity 0.15s;`;
      minimizeBtn.title = "Minimize";

      const closeBtn = document.createElement("button");
      closeBtn.style.cssText = `width:10px;height:10px;border-radius:50%;background:#ef4444;border:none;cursor:pointer;transition:opacity 0.15s;`;
      closeBtn.title = "Close";

      let minimized = false;
      minimizeBtn.addEventListener("click", () => {
        minimized = !minimized;
        content.style.display = minimized ? "none" : "block";
      });

      closeBtn.addEventListener("click", () => win.remove());

      controls.appendChild(minimizeBtn);
      controls.appendChild(closeBtn);
      titlebar.appendChild(titleEl);
      titlebar.appendChild(controls);

      const content = document.createElement("div");
      content.className = "tailweb-content";
      content.style.cssText = "padding: 12px; display:flex; flex-direction:column; gap:8px;";

      win.appendChild(titlebar);
      win.appendChild(content);
      document.body.appendChild(win);
      makeDraggable(win, titlebar);

      let locked = false;
      let keyScreen = null;

      function showKeyScreen() {
        if (keyScreen) return;
        keyScreen = document.createElement("div");
        keyScreen.className = "tailweb-keyscreen";

        const ksTitle = document.createElement("div");
        ksTitle.textContent = title || "Tailweb";
        ksTitle.style.cssText = `font-size: 15px; font-weight: 700; color: #fff; letter-spacing: 0.05em;`;

        const ksDesc = document.createElement("div");
        ksDesc.textContent = "Enter your key to continue.";
        ksDesc.style.cssText = `font-size: 11px; color: #6b7280; text-align: center;`;

        const ksInput = document.createElement("input");
        ksInput.type = "text";
        ksInput.placeholder = "Enter Key";
        ksInput.style.cssText = `
          background: ${accentHex}15; border: 1px solid ${accentHex}33;
          border-radius: 5px; padding: 8px 12px; color: #fff; font-size: 12px;
          font-family: inherit; outline: none; width: 100%; box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s;
        `;
        ksInput.addEventListener("focus", () => {
          ksInput.style.borderColor = accentHex + "99";
          ksInput.style.background = accentHex + "25";
        });
        ksInput.addEventListener("blur", () => {
          ksInput.style.borderColor = accentHex + "33";
          ksInput.style.background = accentHex + "15";
        });

        const ksError = document.createElement("div");
        ksError.style.cssText = `font-size: 10px; color: #ef4444; min-height: 14px;`;

        const ksBtns = document.createElement("div");
        ksBtns.style.cssText = "display:flex;gap:8px;width:100%;";

        function makeKsBtn(label, cb) {
          const b = document.createElement("button");
          b.textContent = label;
          b.style.cssText = `
            flex: 1; padding: 7px 10px; border-radius: 6px; border: 1px solid ${accentHex}33;
            background: ${accentHex}18; color: #fff; font-size: 11px; font-weight: 500;
            cursor: pointer; transition: background 0.15s, border-color 0.15s; font-family: inherit;
          `;
          b.addEventListener("mouseenter", () => { b.style.background = accentHex + "33"; b.style.borderColor = accentHex + "88"; });
          b.addEventListener("mouseleave", () => { b.style.background = accentHex + "18"; b.style.borderColor = accentHex + "33"; });
          b.addEventListener("click", cb);
          return b;
        }

        const exitBtn = makeKsBtn("Exit", () => win.remove());
        const getKeyBtn = makeKsBtn("Get Key", () => {
          if (typeof getKey === "function") getKey();
          else console.log("[Tailweb] No getKey callback provided.");
        });
        const submitBtn = makeKsBtn("Submit", () => {
          const entered = ksInput.value.trim();
          if (entered === requiredKey) {
            keyScreen.remove();
            keyScreen = null;
            locked = false;
          } else {
            ksError.textContent = "Invalid key.";
            ksInput.style.borderColor = "#ef444499";
            setTimeout(() => {
              ksError.textContent = "";
              ksInput.style.borderColor = accentHex + "33";
            }, 2000);
          }
        });

        ksBtns.appendChild(exitBtn);
        ksBtns.appendChild(getKeyBtn);
        ksBtns.appendChild(submitBtn);

        keyScreen.appendChild(ksTitle);
        keyScreen.appendChild(ksDesc);
        keyScreen.appendChild(ksInput);
        keyScreen.appendChild(ksError);
        keyScreen.appendChild(ksBtns);
        win.appendChild(keyScreen);
      }

      if (requiredKey) {
        locked = true;
        showKeyScreen();
      }

      console.log(`[Tailweb] Window "${title || "Tailweb"}" created.`);

      const api = {
        Button({ title: btnTitle, callback } = {}) {
          const btn = document.createElement("button");
          btn.textContent = btnTitle || "Button";
          btn.style.cssText = `
            padding: 6px 14px; border-radius: 6px; border: 1px solid ${accentHex}33;
            background: ${accentHex}18; color: #fff; font-size: 12px; font-weight: 500;
            cursor: pointer; transition: background 0.15s, border-color 0.15s;
            font-family: inherit; width: fit-content; text-align: left; letter-spacing: 0.02em;
          `;
          btn.addEventListener("mouseenter", () => {
            btn.style.background = accentHex + "33";
            btn.style.borderColor = accentHex + "88";
          });
          btn.addEventListener("mouseleave", () => {
            btn.style.background = accentHex + "18";
            btn.style.borderColor = accentHex + "33";
          });
          if (typeof callback === "function") btn.addEventListener("click", callback);
          content.appendChild(btn);
          return api;
        },

        Label({ title: labelTitle, size } = {}) {
          const el = document.createElement("div");
          const px = size ? `${size}px` : "10px";
          el.textContent = labelTitle || "";
          el.style.cssText = `font-size: ${px}; color: #d1d5db; line-height: 1.5; padding: 1px 0;`;
          content.appendChild(el);
          return api;
        },

        TextBox({ title: tbTitle, placeholder, variable, value, updateBlur } = {}) {
          const wrap = document.createElement("div");
          wrap.style.cssText = "display:flex;flex-direction:column;gap:3px;";

          if (tbTitle) {
            const lbl = document.createElement("label");
            lbl.textContent = tbTitle;
            lbl.style.cssText = "font-size: 10px; color: #9ca3af; letter-spacing: 0.04em;";
            wrap.appendChild(lbl);
          }

          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = placeholder || "";
          input.value = value !== undefined ? value : "";
          input.style.cssText = `
            background: ${accentHex}15; border: 1px solid ${accentHex}33;
            border-radius: 5px; padding: 5px 9px; color: #fff; font-size: 12px;
            font-family: inherit; outline: none; width: 172px; box-sizing: border-box;
            transition: border-color 0.15s, background 0.15s;
          `;
          input.addEventListener("focus", () => {
            input.style.borderColor = accentHex + "99";
            input.style.background = accentHex + "25";
          });
          input.addEventListener("blur", () => {
            input.style.borderColor = accentHex + "33";
            input.style.background = accentHex + "15";
          });

          const applyValue = (val) => {
            if (variable !== undefined) {
              if (typeof variable === "object" && variable !== null && "__tailwebRef" in variable) {
                variable.__tailwebRef.value = val;
              }
            }
          };

          if (updateBlur) {
            input.addEventListener("blur", () => applyValue(input.value));
          } else {
            input.addEventListener("input", () => applyValue(input.value));
          }

          wrap.appendChild(input);
          content.appendChild(wrap);
          return api;
        },

        Lock() {
          if (locked) return api;
          locked = true;
          showKeyScreen();
          return api;
        },

        Remove() {
          win.remove();
        },

        Key({ key } = {}) {
          if (!key) return api;
          document.addEventListener("keydown", (e) => {
            if (e.key === key) {
              win.style.display = win.style.display === "none" ? "block" : "none";
            }
          });
          return api;
        },
      };

      return new Proxy(api, {
        get(target, prop) {
          if (prop in target) return target[prop];
          return undefined;
        },
      });
    },
  };

  global.tailweb = tailweb;
  console.log("[Tailweb] Loaded. Use tailweb.Window({...}) to get started.");
})(window);