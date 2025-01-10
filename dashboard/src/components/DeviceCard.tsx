import deviceTypes from "../mocks/device_types.json";
import lightSensorImg from "../assets/light_sensor.png";
import doorWindowSensorImg from "../assets/door_window_sensor.png";
import smokeDetectorImg from "../assets/smoke_detector.png";
import waterLeakSensorImg from "../assets/water_leak_sensor.png";
import temperatureHumiditySensorImg from "../assets/temperature_humidity_sensor.png";
import classNames from "classnames";

type DeviceCardProps = {
  deviceType: string;
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ deviceType }) => {
  const device = deviceTypes.filter(
    (device) => device.type_id === deviceType
  )[0];

  return (
    <div className="bg-[#353535] rounded-3xl hover:shadow-2xl hover:scale-105 duration-200 hover:bg-[#3f3f3f] cursor-pointer">
      <div className="text-white text-lg font-bold border-b p-3 border-[#AEAEAE]">
        {device?.name}
      </div>
      <div className="border-b border-[#AEAEAE] flex justify-center">
        <img
          src={
            deviceType === "light_sensor"
              ? lightSensorImg
              : deviceType === "door_window_sensor"
              ? doorWindowSensorImg
              : deviceType === "smoke_detector"
              ? smokeDetectorImg
              : deviceType === "water_leak_sensor"
              ? waterLeakSensorImg
              : deviceType === "temperature_humidity_sensor"
              ? temperatureHumiditySensorImg
              : ""
          }
          className="w-[20rem]"
        />
      </div>
      <div className="p-3 flex-col space-y-1">
        {device?.values.map((value) => (
          <div className="text-white flex gap-2">
            <p
              className={classNames(
                "font-semibold",
                value.type == "boolean" && "mt-1"
              )}
            >
              {value.name}:
            </p>
            {value.type === "boolean" ? (
              Math.random() > 0.5 ? (
                <p className="text-white font-semibold bg-green-700 px-2 py-1 rounded-full">
                  PRAWDA
                </p>
              ) : (
                <p className="text-white font-semibold bg-red-700 px-2 py-1 rounded-full">
                  FAŁSZ
                </p>
              )
            ) : (
              <div className="flex gap-1">
                <p>{Math.random() * 100}</p>
                <p>{value.unit}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-[#AEAEAE] flex gap-1 border-t p-3">
        <p className="font-semibold">Ostatnia aktualizacja:</p>
        {new Date().toLocaleString("pl-PL")}
      </div>
    </div>
  );
};
