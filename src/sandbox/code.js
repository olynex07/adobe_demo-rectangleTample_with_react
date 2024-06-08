import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

function start() {
  const sandboxApi = {
    createRectangle: (width, height, centerX, centerY, colorHex) => {
      const rectangle = editor.createRectangle();

      // Define rectangle dimensions.
      rectangle.width = width;
      rectangle.height = height;

      // Define rectangle position.
      rectangle.translation = { x: centerX, y: centerY };

      // Convert hex color to RGB
      const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        return {
          red: ((bigint >> 16) & 255) / 255,
          green: ((bigint >> 8) & 255) / 255,
          blue: (bigint & 255) / 255,
          alpha: 1,
        };
      };

      const color = hexToRgb(colorHex);

      // Fill the rectangle with the color.
      const rectangleFill = editor.makeColorFill(color);
      rectangle.fill = rectangleFill;

      // Add the rectangle to the document.
      editor.context.insertionParent.children.append(rectangle);
    },
  };

  // Expose `sandboxApi` to the UI runtime.
  runtime.exposeApi(sandboxApi);
}

start();
