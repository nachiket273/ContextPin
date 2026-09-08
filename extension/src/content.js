(() => {
  "use strict";

  let askButton = null;

  function removeAskButton() {
    if (askButton) {
      askButton.remove();
      askButton = null;
    }
  }

  function getSelection() {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const text = selection.toString().trim();

    if (!text) {
      return null;
    }

    const range = selection.getRangeAt(0);

    return {
      text,
      rect: range.getBoundingClientRect()
    };
  }

  function createAskButton(selection) {
    removeAskButton();

    const button = document.createElement("button");

    button.textContent = "Ask";

    button.setAttribute("type", "button");
    button.setAttribute("aria-label", "Ask ContextPin about this text");

    Object.assign(button.style, {
      position: "absolute",
      zIndex: "2147483647",
      padding: "6px 10px",
      border: "1px solid #d0d0d0",
      borderRadius: "6px",
      background: "#ffffff",
      color: "#222222",
      fontSize: "13px",
      fontFamily: "system-ui, sans-serif",
      lineHeight: "1.2",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
    });

    document.body.appendChild(button);

    const rect = selection.rect;

    const top = rect.bottom + window.scrollY + 6;
    const left = rect.left + window.scrollX;

    button.style.top = `${top}px`;
    button.style.left = `${left}px`;

    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });

    button.addEventListener("click", () => {
      console.log("ContextPin selection:", selection.text);
    });

    askButton = button;
  }

  document.addEventListener("mouseup", () => {
    setTimeout(() => {
      const selection = getSelection();

      if (!selection) {
        removeAskButton();
        return;
      }

      createAskButton(selection);
    }, 0);
  });

  document.addEventListener("mousedown", (event) => {
    if (askButton && !askButton.contains(event.target)) {
      removeAskButton();
    }
  });
})();