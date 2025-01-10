import { Navbar } from "./components/Navbar";
import { DeviceCard } from "./components/DeviceCard";
import deviceTypes from "./mocks/device_types.json";

function App() {
  return (
    <>
      <div className="">
        <Navbar />
        <div className="flex flex-wrap justify-center gap-5 p-10">
          {deviceTypes.map((device) => (
            <DeviceCard deviceType={device.type_id} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
