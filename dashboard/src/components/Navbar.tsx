type NavbarProps = {
  mqttStatus: string;
};

export const Navbar: React.FC<NavbarProps> = ({ mqttStatus }) => {
  return (
    <nav className="bg-[#353535] p-5 shadow-xl">
      <div className="flex">
        <div className="text-white text-lg font-bold">iot-mqtt-dashboard</div>
        <p>{mqttStatus}</p>
      </div>
    </nav>
  );
};
