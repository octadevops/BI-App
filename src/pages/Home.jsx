import { useEffect, useState } from "react";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    setIsLoggedIn(!!token);
    setUsername(user || "");
  }, []);

  return (
    <div>
      <div className="h-screen w-full bg-gray-700 p-5">
        <div className="h-full flex flex-col justify-center items-center">
          {isLoggedIn && (
            <div>
              <h1 className="text-xl text-white font-bold py-3">
                Howdy! <span>{username}</span>
              </h1>
              <p className="text-xl text-white">Welcome to NOLIMIT!!!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
