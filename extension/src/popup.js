(() => {
  "use strict";

  let popup = null;

  function removePopup() {
    if (popup) {
      popup.remove();
      popup = null;
    }
  }

  function createPopup(selection) {
    removePopup();

    popup = document.createElement("div");

    popup.id = "contextpin-popup";

    Object.assign(popup.style, {
      position: "absolute",
      zIndex: "2147483647",
      width: "320px",
      maxWidth: "calc(100vw - 24px)",
      background: "#ffffff",
      color: "#222222",
      border: "1px solid #d6d6d6",
      borderRadius: "10px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.16)",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: "14px",
      overflow: "hidden"
    });

    popup.innerHTML = `
      <div id="contextpin-popup-header">
        <div id="contextpin-popup-title">
          ContextPin
        </div>

        <button
          id="contextpin-close"
          type="button"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div id="contextpin-selection"></div>

      <div id="contextpin-actions">
        <button type="button" data-action="explain">
          Explain
        </button>

        <button type="button" data-action="why">
          Why?
        </button>

        <button type="button" data-action="simplify">
          Simplify
        </button>
      </div>

      <div id="contextpin-input-row">
        <input
          id="contextpin-input"
          type="text"
          placeholder="Ask a question..."
        />

        <button
          id="contextpin-submit"
          type="button"
        >
          Ask
        </button>
      </div>

      <div
        id="contextpin-response"
        aria-live="polite"
      ></div>
    `;

    document.body.appendChild(popup);

    popup.addEventListener("mousedown", (event) => {
        event.stopPropagation();
    });


    const selectionElement =
      popup.querySelector("#contextpin-selection");

    selectionElement.textContent = selection.text;

    const responseElement =
      popup.querySelector("#contextpin-response");

    popup.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;

        responseElement.textContent =
          `Mock response for "${action}".`;
      });
    });

    popup.querySelector("#contextpin-submit").addEventListener(
      "click",
      () => {
        const input = popup.querySelector("#contextpin-input");
        const question = input.value.trim();

        if (!question) {
          return;
        }

        responseElement.textContent =
          `Mock answer to: "${question}"`;
      }
    );

    popup.querySelector("#contextpin-close").addEventListener(
      "click",
      () => {
        removePopup();
      }
    );

    positionPopup(selection.rect);
  }

  function positionPopup(rect) {
    const margin = 12;

    const popupRect = popup.getBoundingClientRect();

    let left =
      rect.left +
      window.scrollX;

    let top =
      rect.bottom +
      window.scrollY +
      10;

    const viewportRight =
      window.scrollX +
      window.innerWidth -
      margin;

    const viewportBottom =
      window.scrollY +
      window.innerHeight -
      margin;

    if (left + popupRect.width > viewportRight) {
      left =
        viewportRight -
        popupRect.width;
    }

    if (left < window.scrollX + margin) {
      left =
        window.scrollX + margin;
    }

    if (top + popupRect.height > viewportBottom) {
      top =
        rect.top +
        window.scrollY -
        popupRect.height -
        10;
    }

    if (top < window.scrollY + margin) {
      top =
        window.scrollY + margin;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }

  window.ContextPinPopup = {
    open: createPopup,
    close: removePopup
  };
})();