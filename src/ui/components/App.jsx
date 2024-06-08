import React, { useEffect, useState } from "react";
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/link/sp-link.js";
import { Link } from "@spectrum-web-components/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./App.css";
import Swal from "sweetalert2";
import axios from "axios";

const App = ({ sandboxProxy, addOnUISdk }) => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(150);
  const [centerX, setCenterX] = useState(20);
  const [centerY, setCenterY] = useState(20);
  const [color, setColor] = useState("#5290ff");
  const [icons, setIcons] = useState([]);
  const [pluning, setPluning] = useState(null);

  const fetchPluningData = async () => {
    try {
      const res = await axios.get("https://icon-server.vercel.app/plunings");
      if (res.data && res.data.length > 0) {
        // Assuming the API returns an array of plunings and we need the latest one
        const sortedPlunings = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setPluning(sortedPlunings[0]); // Set the latest pluning
      }
    } catch (error) {
      console.error("Failed to fetch pluning data:", error);
    }
  };

  useEffect(() => {
    const getIconsData = async () => {
      try {
        const res = await axios.get("https://icon-server.vercel.app/adobe-icon");
        setIcons(res.data);
      } catch (error) {
        console.error("Failed to fetch icons data:", error);
      }
    };

    getIconsData();
    fetchPluningData();

    // Set an interval to check pluning status every minute
    const interval = setInterval(() => {
      fetchPluningData();
    }, 2000); // 60,000 milliseconds = 1 minute

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  console.log(pluning);

  const isUserPremium = () => {
    if (!pluning) return false;

    const currentDate = new Date();
    const paymentDate = new Date(pluning?.buyDate);

    if (pluning?.unlimited) {
      return true;
    } else {
      const differenceInDays = Math.floor(
        (currentDate - paymentDate) / (1000 * 60 * 60 * 24)
      );
      return differenceInDays <= pluning?.durationDays;
    }
  };

  async function getBlob(url) {
    return await fetch(url).then((response) => response.blob());
  }

  const handleIconClick = async (iconUrl) => {
    const blob = await getBlob(iconUrl.img);
    if (iconUrl?.type === "free" || isUserPremium()) {
      addOnUISdk.app.document.addImage(blob);
    } else {
      Swal.fire({
        title: "Opps!",
        text: "This is a premium icon. Would you like to purchase it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "http://localhost:5173";
          // <Link href="https://olynex.com">example link</Link>
          // window.open("https://example.com/your-exported-design.pdf")
        }
      });
    }
  };

  const handleClick = () => {
    sandboxProxy.createRectangle(
      Number(width),
      Number(height),
      Number(centerX),
      Number(centerY),
      color
    );
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
          {icons.map((img, i) => (
            <div
              key={i}
              className="w-full cursor-pointer rounded-md"
              onClick={() => handleIconClick(img)}
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
