import deviceTypes from "../mocks/device_types.json";
import lightSensorImg from "../assets/light_sensor.png";
import doorWindowSensorImg from "../assets/door_window_sensor.png";
import smokeDetectorImg from "../assets/smoke_detector.png";
import waterLeakSensorImg from "../assets/water_leak_sensor.png";
import temperatureHumiditySensorImg from "../assets/temperature_humidity_sensor.png";

type DeviceCardProps = {
  brokerData?: { topic: string; message: string };
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ brokerData }) => {
  const deviceData = JSON.parse(brokerData?.message || "{}");
  const deviceSchema = deviceTypes.find(
    (device) => device.type_id === deviceData.device_type
  );

  const formatValue = (value: number) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  };

  return (
    <div className="bg-[#353535] rounded-3xl hover:shadow-xl hover:scale-105 duration-200 hover:bg-[#3f3f3f] cursor-pointer shadow-md">
      <div className="border-b p-3 border-[#AEAEAE]">
        <p className="text-white text-lg font-bold">{deviceSchema?.name}</p>
        <p className="text-[#AEAEAE]">{deviceData.mac_addr}</p>
      </div>
      <div className="border-b border-[#AEAEAE] flex justify-center">
        <img
          src={
            deviceData.device_type === "light_sensor"
              ? lightSensorImg
              : deviceSchema?.type_id === "door_window_sensor"
              ? doorWindowSensorImg
              : deviceSchema?.type_id === "smoke_detector"
              ? smokeDetectorImg
              : deviceSchema?.type_id === "water_leak_sensor"
              ? waterLeakSensorImg
              : deviceSchema?.type_id === "temperature_humidity_sensor"
              ? temperatureHumiditySensorImg
              : ""
          }
          className="w-[20rem]"
        />
      </div>
      <div className="p-3 flex-col space-y-1">
        <div className="text-white flex gap-2">
          <p className="font-semibold">Poziom baterii:</p>
          <p>{formatValue(deviceData.battery_level * 100)}%</p>
        </div>
        <div className="text-white flex-col space-y-1">
          {typeof deviceData.values[0] === "boolean" ? (
            <div className="flex gap-2">
              <p className="font-semibold mt-1">
                {deviceSchema?.values[0].name}:
              </p>
              {deviceData.values[0] ? (
                <p className="text-white font-semibold bg-yellow-700/65 px-2 py-1 rounded-full">
                  WYKRYTO
                </p>
              ) : (
                <p className="text-white font-semibold bg-green-700/65 px-3 py-1 rounded-full">
                  BRAK
                </p>
              )}
            </div>
          ) : (
            deviceData.values.map((value: number, index: number) => (
              <div key={index} className="flex gap-1">
                <p className="font-semibold">
                  {deviceSchema?.values[index].name}:
                </p>
                <div className="flex">
                  <p>
                    {deviceData.device_type === "light_sensor"
                      ? formatValue(value * 100)
                      : formatValue(value)}{" "}
                  </p>
                  <p>{deviceSchema?.values[index].unit}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-[#AEAEAE] flex gap-1 border-t p-3">
        <p className="font-semibold">Ostatnia zmiana:</p>
        {deviceData.timestamp ? (
          <p>{new Date(deviceData.timestamp).toLocaleString("pl-PL")}</p>
        ) : (
          <p>Brak danych</p>
        )}
      </div>
    </div>
  );
};
