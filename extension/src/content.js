(() => {
  "use strict";

  let askButton = null;
  let currentSelection = null;

  // Prevent the document-level mouseup handler
  // from recreating the Ask button when the
  // existing Ask button is clicked.
  let suppressNextMouseUp = false;

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

    currentSelection = selection;

    const button = document.createElement("button");

    button.textContent = "Ask";
    button.type = "button";
    button.id = "contextpin-ask-button";

    button.setAttribute(
      "aria-label",
      "Ask ContextPin about this text"
    );

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

    positionAskButton(button, selection.rect);

    /*
     * Important:
     *
     * The Ask button itself causes mousedown -> mouseup -> click.
     * The document-level mouseup handler would normally see the
     * original text selection and create another Ask button.
     *
     * We suppress that mouseup.
     */
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();

      suppressNextMouseUp = true;
    });

    button.addEventListener("click", () => {
      const selectionToOpen = currentSelection;

      // Remove Ask button first.
      removeAskButton();

      // Clear the browser selection.
      const browserSelection = window.getSelection();

      if (browserSelection) {
        browserSelection.removeAllRanges();
      }

      // Open popup using the saved selection.
      window.ContextPinPopup.open(selectionToOpen);
    });

    askButton = button;
  }

  function positionAskButton(button, rect) {
    const margin = 8;

    const buttonRect = button.getBoundingClientRect();

    let left =
      rect.left +
      window.scrollX;

    let top =
      rect.bottom +
      window.scrollY +
      margin;

    const viewportRight =
      window.scrollX +
      window.innerWidth -
      margin;

    const viewportBottom =
      window.scrollY +
      window.innerHeight -
      margin;

    /*
     * Keep the button inside the right edge.
     */
    if (left + buttonRect.width > viewportRight) {
      left =
        viewportRight -
        buttonRect.width;
    }

    /*
     * Keep the button inside the left edge.
     */
    if (left < window.scrollX + margin) {
      left =
        window.scrollX + margin;
    }

    /*
     * If there isn't enough room below the selection,
     * place the button above it.
     */
    if (
      top + buttonRect.height >
      viewportBottom
    ) {
      top =
        rect.top +
        window.scrollY -
        buttonRect.height -
        margin;
    }

    /*
     * Final vertical safety check.
     */
    if (top < window.scrollY + margin) {
      top =
        window.scrollY + margin;
    }

    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
  }

  /*
   * Detect text selection.
   */
  document.addEventListener("mouseup", (event) => {
    /*
     * If this mouseup belongs to the Ask button,
     * do not recreate the Ask button.
     */
    if (suppressNextMouseUp) {
      suppressNextMouseUp = false;
      return;
    }

    /*
     * Ignore mouseup events occurring inside
     * the ContextPin popup.
     */
    const popup = document.querySelector("#contextpin-popup");

    if (popup && popup.contains(event.target)) {
      return;
    }

    setTimeout(() => {
      const selection = getSelection();

      if (!selection) {
        removeAskButton();
        return;
      }

      createAskButton(selection);
    }, 0);
  });

  /*
   * Clicking somewhere else dismisses the Ask button.
   */
  document.addEventListener("mousedown", (event) => {
    /*
     * Don't dismiss the Ask button if the user
     * is interacting with it.
     */
    if (
      askButton &&
      !askButton.contains(event.target)
    ) {
      removeAskButton();
    }
  });
})();