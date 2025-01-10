import { Navbar } from "./components/Navbar";
import { DeviceCard } from "./components/DeviceCard";
import deviceTypes from "./mocks/device_types.json";
import mqtt from "mqtt";
import { useEffect, useState } from "react";

function App() {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState("Disconnected");
  const [payload, setPayload] = useState<{ topic: string; message: string } | null>(null);
  const host = "ws://localhost:9001";

  const mqttConnect = (host: string, mqttOption: mqtt.IClientOptions) => {
    setConnectStatus("Connecting");
    const mqttClient = mqtt.connect(host, mqttOption);
    setClient(mqttClient);
  };

  useEffect(() => {
    mqttConnect(host, {
      keepalive: 60,
      clean: true,
    });
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        console.log("Connected");
        setConnectStatus("Connected");
        client.subscribe("iot_devices/#", (err) => {
          if (err) {
            console.error("Subscription error: ", err);
          } else {
            console.log("Subscribed to iot_devices");
          }
        });
      });

      client.on("error", (err) => {
        console.error("Connection error: ", err);
      });

      client.on("reconnect", () => {
        console.log("Reconnecting");
        setConnectStatus("Reconnecting");
      });

      client.on("disconnect", () => {
        console.warn("Disconnected");
        setConnectStatus("Disconnected");
      });

      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return (
    <div>
      <Navbar mqttStatus={connectStatus as string} />
      <div className="flex flex-wrap justify-center gap-5 p-10">
        {deviceTypes.map((device) => (
          <DeviceCard key={device.type_id} deviceType={device.type_id} />
        ))}
      </div>
    </div>
  );
}

export default App;
