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
        min-width: 300px;
        max-width: 620px;
        min-height: 360px;
        max-height: 478px;
        display: flex;
        flex-direction: column;
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
        flex: 1;
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
        min-width: 300px;
        min-height: 360px;
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
        content.style.display = minimized ? "none" : "flex";
        win.style.minHeight = minimized ? "0" : "";
        win.style.maxHeight = minimized ? "none" : "";
        win.style.height = minimized ? "auto" : "";
      });

      closeBtn.addEventListener("click", () => win.remove());

      controls.appendChild(minimizeBtn);
      controls.appendChild(closeBtn);
      titlebar.appendChild(titleEl);
      titlebar.appendChild(controls);

      const content = document.createElement("div");
      content.className = "tailweb-content";
      content.style.cssText = "padding: 12px; display:flex; flex-direction:column; gap:10px;";

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
        ksTitle.style.cssText = `font-size: 17px; font-weight: 700; color: #fff; letter-spacing: 0.05em;`;

        const ksDesc = document.createElement("div");
        ksDesc.textContent = "Enter your key to continue.";
        ksDesc.style.cssText = `font-size: 12px; color: #6b7280; text-align: center;`;

        const ksInput = document.createElement("input");
        ksInput.type = "text";
        ksInput.placeholder = "Enter Key";
        ksInput.style.cssText = `
          background: ${accentHex}15; border: 1px solid ${accentHex}33;
          border-radius: 5px; padding: 9px 13px; color: #fff; font-size: 13px;
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
        ksError.style.cssText = `font-size: 11px; color: #ef4444; min-height: 14px;`;

        const ksBtns = document.createElement("div");
        ksBtns.style.cssText = "display:flex;gap:8px;width:100%;";

        function makeKsBtn(label, cb) {
          const b = document.createElement("button");
          b.textContent = label;
          b.style.cssText = `
            flex: 1; padding: 8px 11px; border-radius: 6px; border: 1px solid ${accentHex}33;
            background: ${accentHex}18; color: #fff; font-size: 12px; font-weight: 500;
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
          if (validKeys && validKeys.includes(entered)) {
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

      const validKeys = Array.isArray(requiredKey) ? requiredKey : (requiredKey ? [requiredKey] : null);

      if (validKeys) {
        locked = true;
        showKeyScreen();
      }

      console.log(`[Tailweb] Window "${title || "Tailweb"}" created.`);

      const api = {
        Button({ title: btnTitle, callback, icon, iconColor } = {}) {
          const btn = document.createElement("button");
          btn.style.cssText = `
            padding: 7px 15px; border-radius: 6px; border: 1px solid ${accentHex}33;
            background: ${accentHex}18; color: #fff; font-size: 13px; font-weight: 500;
            cursor: pointer; transition: background 0.15s, border-color 0.15s;
            font-family: inherit; width: fit-content; text-align: left; letter-spacing: 0.02em;
            display: flex; align-items: center; gap: 6px;
          `;
          if (icon) {
            const iconColorMap = {
              "gray-500": "#6b7280", "blue-500": "#3b82f6", "red-500": "#ef4444",
              "green-500": "#22c55e", "purple-500": "#a855f7", "yellow-500": "#eab308",
              "pink-500": "#ec4899", "orange-500": "#f97316", "cyan-500": "#06b6d4",
              "indigo-500": "#6366f1", "teal-500": "#14b8a6", "violet-500": "#8b5cf6",
            };
            const resolvedColor = iconColorMap[iconColor] || iconColor || "#ffffff";
            const iconWrap = document.createElement("span");
            iconWrap.style.cssText = "display:flex;align-items:center;width:13px;height:13px;flex-shrink:0;";
            fetch(`https://unpkg.com/lucide-static@latest/icons/${icon}.svg`)
              .then(r => r.text())
              .then(svg => {
                iconWrap.innerHTML = svg;
                const s = iconWrap.querySelector("svg");
                if (s) {
                  s.style.cssText = `width:13px;height:13px;stroke:${resolvedColor};fill:none;`;
                }
              });
            btn.appendChild(iconWrap);
          }
          const txtNode = document.createTextNode(btnTitle || "Button");
          btn.appendChild(txtNode);
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

        Label({ title: labelTitle, size, icon, iconColor } = {}) {
          const el = document.createElement("div");
          const px = size ? `${size}px` : "11px";
          el.style.cssText = `font-size: ${px}; color: #d1d5db; line-height: 1.5; padding: 1px 0; display:flex; align-items:center; gap:6px;`;
          if (icon) {
            const iconColorMap = {
              "gray-500": "#6b7280", "blue-500": "#3b82f6", "red-500": "#ef4444",
              "green-500": "#22c55e", "purple-500": "#a855f7", "yellow-500": "#eab308",
              "pink-500": "#ec4899", "orange-500": "#f97316", "cyan-500": "#06b6d4",
              "indigo-500": "#6366f1", "teal-500": "#14b8a6", "violet-500": "#8b5cf6",
            };
            const resolvedColor = iconColorMap[iconColor] || iconColor || "#ffffff";
            const iconWrap = document.createElement("span");
            iconWrap.style.cssText = `display:flex;align-items:center;width:${px};height:${px};flex-shrink:0;`;
            fetch(`https://unpkg.com/lucide-static@latest/icons/${icon}.svg`)
              .then(r => r.text())
              .then(svg => {
                iconWrap.innerHTML = svg;
                const s = iconWrap.querySelector("svg");
                if (s) {
                  s.style.cssText = `width:${px};height:${px};stroke:${resolvedColor};fill:none;`;
                }
              });
            el.appendChild(iconWrap);
          }
          el.appendChild(document.createTextNode(labelTitle || ""));
          content.appendChild(el);
          return api;
        },

        TextBox({ title: tbTitle, placeholder, variable, value, updateBlur } = {}) {
          const wrap = document.createElement("div");
          wrap.style.cssText = "display:flex;flex-direction:column;gap:3px;";

          if (tbTitle) {
            const lbl = document.createElement("label");
            lbl.textContent = tbTitle;
            lbl.style.cssText = "font-size: 11px; color: #9ca3af; letter-spacing: 0.04em;";
            wrap.appendChild(lbl);
          }

          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = placeholder || "";
          input.value = value !== undefined ? value : "";
          input.style.cssText = `
            background: ${accentHex}15; border: 1px solid ${accentHex}33;
            border-radius: 5px; padding: 6px 10px; color: #fff; font-size: 13px;
            font-family: inherit; outline: none; width: 189px; box-sizing: border-box;
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
          if (!validKeys || locked) return api;
          locked = true;
          showKeyScreen();
          return api;
        },

        Toggle({ title: togTitle, value: togValue, callback: togCallback } = {}) {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;';

          const lbl = document.createElement('div');
          lbl.textContent = togTitle || '';
          lbl.style.cssText = 'font-size:13px;color:#d1d5db;';

          let state = togValue === true;

          const track = document.createElement('div');
          track.style.cssText = `
            width:36px;height:20px;border-radius:999px;flex-shrink:0;cursor:pointer;
            background:${state ? accentHex + 'cc' : 'rgba(255,255,255,0.12)'};
            border:1px solid ${state ? accentHex : 'rgba(255,255,255,0.15)'};
            position:relative;transition:background 0.2s,border-color 0.2s;
          `;

          const thumb = document.createElement('div');
          thumb.style.cssText = `
            width:14px;height:14px;border-radius:50%;background:#fff;
            position:absolute;top:2px;
            left:${state ? '18px' : '2px'};
            transition:left 0.2s;
          `;
          track.appendChild(thumb);

          track.addEventListener('click', () => {
            state = !state;
            track.style.background = state ? accentHex + 'cc' : 'rgba(255,255,255,0.12)';
            track.style.borderColor = state ? accentHex : 'rgba(255,255,255,0.15)';
            thumb.style.left = state ? '18px' : '2px';
            if (typeof togCallback === 'function') togCallback(state);
          });

          wrap.appendChild(lbl);
          wrap.appendChild(track);
          content.appendChild(wrap);
          return api;
        },

        Divider() {
          const hr = document.createElement('div');
          hr.style.cssText = `height:1px;min-height:1px;flex-shrink:0;background:rgba(255,255,255,0.08);margin:2px 0;`;
          content.appendChild(hr);
          return api;
        },

        Remove() {
          win.remove();
        },

        Key({ key } = {}) {
          if (!key) return api;
          document.addEventListener("keydown", (e) => {
            if (e.key === key) {
              win.style.display = win.style.display === "none" ? "flex" : "none";
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

  tailweb.Popup = function({ title, description, icon, button1, button2, button3, cbutton1, cbutton2, cbutton3 } = {}) {
    const accentMap = {
      "gray-500": "#6b7280", "blue-500": "#3b82f6", "red-500": "#ef4444",
      "green-500": "#22c55e", "purple-500": "#a855f7", "yellow-500": "#eab308",
      "pink-500": "#ec4899", "orange-500": "#f97316", "cyan-500": "#06b6d4",
      "indigo-500": "#6366f1", "teal-500": "#14b8a6", "violet-500": "#8b5cf6",
    };

    const windows = document.querySelectorAll('.tailweb-window');
    let accentHex = "#6b7280";
    if (windows.length > 0) {
      const randomWin = windows[Math.floor(Math.random() * windows.length)];
      const titleEl = randomWin.querySelector('span');
      if (titleEl) {
        const col = titleEl.style.color;
        const hex = Object.values(accentMap).find(h => {
          const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
          return col === `rgb(${r}, ${g}, ${b})`;
        });
        if (hex) accentHex = hex;
        else if (col) accentHex = col;
      }
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px);';

    const popup = document.createElement('div');
    popup.style.cssText = `
      background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;
      padding:28px 28px 22px;max-width:420px;width:90%;
      font-family:ui-monospace,'Cascadia Code','Source Code Pro',monospace;
      color:#fff;box-shadow:0 32px 64px -12px rgba(0,0,0,0.9);
    `;

    const close = () => overlay.remove();

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:14px;';

    const titleEl = document.createElement('div');
    titleEl.textContent = title || '';
    titleEl.style.cssText = 'font-size:16px;font-weight:700;color:#fff;letter-spacing:-0.01em;';
    header.appendChild(titleEl);
    popup.appendChild(header);

    if (description) {
      const desc = document.createElement('div');
      desc.textContent = description;
      desc.style.cssText = 'font-size:13px;color:#71717a;line-height:1.6;margin-bottom:24px;';
      popup.appendChild(desc);
    } else {
      popup.style.paddingBottom = '22px';
    }

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:20px;';

    function makeBtn(label, cb, isPrimary, withIcon) {
      const b = document.createElement('button');
      b.style.cssText = `
        padding:8px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;
        font-family:inherit;transition:background 0.15s,border-color 0.15s;
        display:flex;align-items:center;gap:7px;
        border:1px solid ${isPrimary ? accentHex + '55' : 'rgba(255,255,255,0.1)'};
        background:${isPrimary ? accentHex + '22' : 'rgba(255,255,255,0.05)'};
        color:#fff;
      `;
      b.addEventListener('mouseenter', () => {
        b.style.background = isPrimary ? accentHex + '33' : 'rgba(255,255,255,0.1)';
        b.style.borderColor = isPrimary ? accentHex + '88' : 'rgba(255,255,255,0.2)';
      });
      b.addEventListener('mouseleave', () => {
        b.style.background = isPrimary ? accentHex + '22' : 'rgba(255,255,255,0.05)';
        b.style.borderColor = isPrimary ? accentHex + '55' : 'rgba(255,255,255,0.1)';
      });
      if (withIcon) {
        const iconWrap = document.createElement('span');
        iconWrap.style.cssText = 'display:flex;align-items:center;width:13px;height:13px;flex-shrink:0;';
        fetch(`https://unpkg.com/lucide-static@latest/icons/${withIcon}.svg`)
          .then(r => r.text())
          .then(svg => {
            iconWrap.innerHTML = svg;
            const s = iconWrap.querySelector('svg');
            if (s) s.style.cssText = 'width:13px;height:13px;stroke:#fff;fill:none;';
          });
        b.appendChild(iconWrap);
      }
      b.appendChild(document.createTextNode(label));
      b.addEventListener('click', () => { close(); if (typeof cb === 'function') cb(); });
      return b;
    }

    const hasBtn2 = !!button2;
    const hasBtn3 = !!button3;
    const autoCancel = button1 && !hasBtn2 && !hasBtn3;

    if (hasBtn3) btnRow.appendChild(makeBtn(button3, cbutton3, false, null));
    if (hasBtn2) btnRow.appendChild(makeBtn(button2, cbutton2, false, null));
    else if (autoCancel) btnRow.appendChild(makeBtn('Cancel', null, false, null));
    if (button1) btnRow.appendChild(makeBtn(button1, cbutton1, true, icon || null));

    popup.appendChild(btnRow);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  };

  tailweb.Notify = function({ title, description, icon, time } = {}) {
    const accentMap = {
      "gray-500": "#6b7280", "blue-500": "#3b82f6", "red-500": "#ef4444",
      "green-500": "#22c55e", "purple-500": "#a855f7", "yellow-500": "#eab308",
      "pink-500": "#ec4899", "orange-500": "#f97316", "cyan-500": "#06b6d4",
      "indigo-500": "#6366f1", "teal-500": "#14b8a6", "violet-500": "#8b5cf6",
    };

    const windows = document.querySelectorAll('.tailweb-window');
    let accentHex = "#6b7280";
    if (windows.length > 0) {
      const randomWin = windows[Math.floor(Math.random() * windows.length)];
      const titleEl = randomWin.querySelector('span');
      if (titleEl) {
        const col = titleEl.style.color;
        const hex = Object.values(accentMap).find(h => {
          const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
          return col === `rgb(${r}, ${g}, ${b})`;
        });
        if (hex) accentHex = hex;
        else if (col) accentHex = col;
      }
    }

    const duration = typeof time === 'number' ? time : 3;

    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      background: #111; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px; padding: 16px 18px 0;
      font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
      color: #fff; min-width: 280px; max-width: 360px;
      box-shadow: 0 16px 40px -8px rgba(0,0,0,0.8);
      overflow: hidden;
      opacity: 0; transform: translateY(12px);
      transition: opacity 0.2s ease, transform 0.2s ease;
    `;

    const body = document.createElement('div');
    body.style.cssText = 'display:flex;align-items:flex-start;gap:14px;padding-bottom:14px;';

    if (icon) {
      const iconWrap = document.createElement('div');
      iconWrap.style.cssText = 'width:32px;height:32px;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:2px;';
      fetch(`https://unpkg.com/lucide-static@latest/icons/${icon}.svg`)
        .then(r => r.text())
        .then(svg => {
          iconWrap.innerHTML = svg;
          const s = iconWrap.querySelector('svg');
          if (s) s.style.cssText = `width:32px;height:32px;stroke:${accentHex};fill:none;`;
        });
      body.appendChild(iconWrap);
    }

    const textWrap = document.createElement('div');
    textWrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;flex:1;';

    const titleEl = document.createElement('div');
    titleEl.textContent = title || '';
    titleEl.style.cssText = 'font-size:13px;font-weight:600;color:#fff;letter-spacing:-0.01em;';
    textWrap.appendChild(titleEl);

    if (description) {
      const desc = document.createElement('div');
      desc.textContent = description;
      desc.style.cssText = 'font-size:12px;color:#71717a;line-height:1.5;';
      textWrap.appendChild(desc);
    }

    body.appendChild(textWrap);
    toast.appendChild(body);

    const barWrap = document.createElement('div');
    barWrap.style.cssText = 'width:calc(100% + 36px);height:3px;background:rgba(255,255,255,0.06);margin:14px -18px 0;border-radius:0 0 12px 12px;overflow:hidden;';
    const bar = document.createElement('div');
    bar.style.cssText = `height:3px;background:${accentHex};width:100%;transform-origin:right;transition:transform ${duration}s linear;`;
    barWrap.appendChild(bar);
    toast.appendChild(barWrap);

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        bar.style.transform = 'scaleX(0)';
      });
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 220);
    }, duration * 1000);
  };

  global.tailweb = tailweb;
  console.log("[Tailweb] Loaded. Use tailweb.Window({...}) to get started.");
})(window);