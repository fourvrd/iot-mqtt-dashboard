import { Navbar } from "./components/Navbar";
import { DeviceCard } from "./components/DeviceCard";
import mqtt from "mqtt";
import { useEffect, useState } from "react";

interface Payload {
  topic: string;
  message: string;
}

function App() {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState("ROZŁĄCZONO");
  const [payloads, setPayloads] = useState<Payload[]>([]);
  const host = "ws://localhost:9001";

  const mqttConnect = (host: string, mqttOption: mqtt.IClientOptions) => {
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
        setConnectStatus("POŁĄCZONO");
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
        setConnectStatus("ŁĄCZENIE");
      });

      client.on("disconnect", () => {
        console.warn("Disconnected");
        setConnectStatus("ROZŁĄCZONO");
      });

      client.on("message", (topic, message) => {
        const messageStr = message.toString();
        if (messageStr.trim() === "") {
          setPayloads((prevPayloads) =>
            prevPayloads.filter((payload) => payload.topic !== topic)
          );
        } else {
          const newPayload = { topic, message: messageStr };
          setPayloads((prevPayloads) => {
            const index = prevPayloads.findIndex(
              (payload) => payload.topic === topic
            );
            if (index !== -1) {
              const updatedPayloads = [...prevPayloads];
              updatedPayloads[index] = newPayload;
              return updatedPayloads;
            } else {
              return [...prevPayloads, newPayload];
            }
          });
        }
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
        {/* {deviceTypes.map((device) => (
          <DeviceCard key={device.type_id} deviceType={device.type_id} />
        ))} */}
        <div className="flex flex-wrap gap-5">
          {payloads.map((payload, index) => (
            <DeviceCard
              key={index}
              brokerData={payload}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
