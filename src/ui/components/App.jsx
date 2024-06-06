// App.jsx
import React, { useState, useEffect } from "react";
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./App.css";

const imagesFromAPI = [
  {
    img: "https://i.ibb.co/r304NRs/hans-isaacson-q-Tj-O9-RFFO0g-unsplash.png"
  },
  {
    img: "https://i.ibb.co/85GxsMp/leo-visions-I62h3-Pv-JSI-unsplash.jpg"
  },
  {
    img: "https://i.ibb.co/8s5cWCw/matthew-hamilton-m-TJg-L0-YQp-U-unsplash.jpg"
  },
  {
    img: "https://i.ibb.co/fXhsZff/wade-meng-Lg-Cj9qcrfh-I-unsplash.jpg"
  },
  {
    img: "https://i.ibb.co/vXSjSXM/matthieu-rochette-F3-Nmwc-QLzu8-unsplash.jpg"
  },
  {
    img: "https://i.ibb.co/JBX4HGS/emmanuel-cassar-ax4-QBMLQcb-Y-unsplash.jpg"
  },
  {
    img: "https://i.ibb.co/zn6Nf7R/jigar-panchal-Cp4dn8-6-Y5-I-unsplash.jpg"
  },
  {
    img: "https://i.ibb.co/kxMg56Y/clark-van-der-beken-s9-PEAma2h-Nc-unsplash.jpg"
  }
];

const App = ({ sandboxProxy, addOnUISdk }) => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(150);
  const [centerX, setCenterX] = useState(20);
  const [centerY, setCenterY] = useState(20);
  const [color, setColor] = useState("#5290ff");

  useEffect(() => {
    // Wait for the SDK to be ready before rendering elements in the DOM.
    addOnUISdk.ready.then(async () => {
      imagesFromAPI.forEach((imageObj, index) => {
        console.log(imageObj);
        const image = document.getElementById(`image-${index}`);

        // Add event listener for click event
        image.addEventListener("click", addToDocument);

        // Enable drag to document for the image.
        addOnUISdk.app.enableDragToDocument(image, {
          previewCallback: (element) => new URL(element.src),
          completionCallback: async (element) => [{ blob: await getBlob(element.src) }],
        });
      });

      // Register event handler for "dragstart" event
      addOnUISdk.app.on("dragstart", startDrag);
      // Register event handler for 'dragend' event
      addOnUISdk.app.on("dragend", endDrag);
    });
  }, [addOnUISdk]);
/**
   * Add image to the document.
   */
const addToDocument = async (event) => {
  const url = event.currentTarget.src;
  console.log(url);
  await getBlob(url);
  sandboxProxy.createIcon(url);
};

/**
 * Handle "dragstart" event
 */
const startDrag = (eventData) => {
  console.log("The drag event has started for", eventData.element.id);
};

  /**
   * Handle "dragend" event
   */
  const endDrag = (eventData) => {
    if (!eventData.dropCancelled) {
      console.log("The drag event has ended for", eventData.element.id);
    } else {
      console.log("The drag event was cancelled for", eventData.element.id);
    }
  };

  /**
   * Get the binary object for the image.
   */
  const getBlob = async (url) => {
    return await fetch(url).then(response => response.blob());
  };

  const handleClick = () => {
    sandboxProxy.createRectangle(Number(width), Number(height), Number(centerX), Number(centerY), color);
  };

  const handleIconClick = (iconUrl) => {
    sandboxProxy.createIcon(iconUrl);
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Rectangle</Tab>
        <Tab>Icons</Tab>
      </TabList>

      <TabPanel>
        <div className="container mx-5">
          <div className="input-container">
            <h2>Width:</h2>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="200px"
            />
          </div>
          <div className="input-container">
            <h2>Height:</h2>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="150px"
            />
          </div>
          <div className="input-container">
            <h2>Center X:</h2>
            <input
              type="number"
              value={centerX}
              onChange={(e) => setCenterX(e.target.value)}
              placeholder="20px"
            />
          </div>
          <div className="input-container">
            <h2>Center Y:</h2>
            <input
              type="number"
              value={centerY}
              onChange={(e) => setCenterY(e.target.value)}
              placeholder="20px"
            />
          </div>
          <div className="input-container">
            <h2>Color:</h2>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#5290ff"
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white text-lg rounded-md px-4 py-2 w-fit"
              onClick={handleClick}
            >
              Generate
            </button>
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <div className="grid grid-cols-2 items-center mx-5 gap-5">
          {imagesFromAPI.map((img, i) => (
            <div
              key={i}
              className="w-full cursor-pointer rounded-md"
              onClick={() => handleIconClick(img.img)}
            >
              <img
                id={`image-${i}`}
                src={img.img}
                className="object-cover w-full rounded-md"
                alt={`Icon ${i}`}
              />
            </div>
          ))}
        </div>
      </TabPanel>
    </Tabs>
  );
};

export default App;
