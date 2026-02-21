import { useState } from "react";
import UsernameScreen from "./UsernameScreen";
import MapComponent from "./MapComponent";

function App() {
  const [username, setUsername] = useState(null);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {username ? (
        <MapComponent username={username} />
      ) : (
        <UsernameScreen onSubmit={setUsername} />
      )}
    </div>
  );
}

export default App;
