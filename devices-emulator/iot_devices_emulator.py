import paho.mqtt.client as mqtt
import random
import time
from datetime import datetime
import json

# MQTT broker settings
BROKER = "localhost"
PORT = 1883
TOPIC = "iot_devices"

# Device types and example value generators
DEVICE_TYPES = {
    "motion_sensor": lambda: round(random.uniform(0, 1), 3),
    "door_window_sensor": lambda: random.choice([True, False]),
    "water_leak_sensor": lambda: random.choice([True, False]),
    "smoke_detector": lambda: random.choice([True, False]),
    "temperature_humidity_sensor": lambda: [round(random.uniform(15, 30), 2), round(random.uniform(0.3, 0.7), 2)]
}

# Generate a random MAC address


def generate_mac():
    return ":".join(f"{random.randint(0, 255):02x}" for _ in range(6))

# Generate device data


def generate_device_data():
    device_type = random.choice(list(DEVICE_TYPES.keys()))
    data = {
        "mac_addr": generate_mac(),
        "device_type": device_type,
        "battery_level": round(random.uniform(0.5, 1.0), 2),
        "value": DEVICE_TYPES[device_type](),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    return data

# Publish data to the MQTT broker


def publish_device_data(client):
    device_data = generate_device_data()
    payload = json.dumps(device_data)
    client.publish(TOPIC, payload)
    print(f"Published: {payload}")


def main():
    # MQTT client setup
    client = mqtt.Client()
    client.connect(BROKER, PORT, 60)

    # Publish data in a loop
    try:
        while True:
            publish_device_data(client)
            time.sleep(5)  # Send data every 5 seconds
    except KeyboardInterrupt:
        print("Stopping emulator.")
        client.disconnect()


if __name__ == "__main__":
    main()
