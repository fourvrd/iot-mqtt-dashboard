import classNames from "classnames";

type NavbarProps = {
  mqttStatus: string;
};

export const Navbar: React.FC<NavbarProps> = ({ mqttStatus }) => {
  return (
    <nav className="bg-[#353535] p-5 shadow-xl">
      <div className="flex gap-5">
        <div className="text-white text-lg font-bold">iot-mqtt-dashboard</div>
        <p className={classNames("text-white font-semibold px-2 rounded-full", mqttStatus == "POŁĄCZONO" ? "bg-green-500/50" : mqttStatus == "ŁĄCZENIE" ? "bg-yellow-500/50" : "bg-red-500/50")}>{mqttStatus}</p>
      </div>
    </nav>
  );
};
