import { useState, useEffect } from "react";

const DateTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="container mx-auto py-2">
      <p className="text-lg font-normal">
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </p>
    </div>
  );
};

export default DateTime;
