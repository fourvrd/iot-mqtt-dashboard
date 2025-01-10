import paho.mqtt.client as mqtt
import random
import time
from datetime import datetime
import json
import asyncio

BROKER = "localhost"
PORT = 1883
TOPIC = "iot_devices"

DEVICE_TYPES = {
    "motion_sensor": lambda: round(random.uniform(0, 1), 3),
    "door_window_sensor": lambda: random.choice([True, False]),
    "water_leak_sensor": lambda: random.choice([True, False]),
    "smoke_detector": lambda: random.choice([True, False]),
    "temperature_humidity_sensor": lambda: [round(random.uniform(15, 30), 2), round(random.uniform(0.3, 0.7), 2)]
}

mac_addresses = {}


def generate_mac_address():
    return ":".join(f"{random.randint(0, 255):02x}" for _ in range(6))


def get_mac_address(device_type, device_number):
    key = f"{device_type}_{device_number}"
    if key not in mac_addresses:
        mac_addresses[key] = generate_mac_address()
    return mac_addresses[key]


def generate_device_data(device_type, device_number):
    data = {
        "mac_addr": get_mac_address(device_type, device_number),
        "device_type": device_type,
        "battery_level": round(random.uniform(0.5, 1.0), 2),
        "value": DEVICE_TYPES[device_type](),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    return data


async def publish_device_data(client, device_type, device_number):
    while True:
        device_data = generate_device_data(device_type, device_number)
        payload = json.dumps(device_data)
        topic = f"{TOPIC}/{device_type}_{device_number}"
        client.publish(topic, payload)
        print(f"Published to {topic}: {payload}")
        await asyncio.sleep(random.uniform(1, 10))


def clear_retained_messages(client):
    for device_type in DEVICE_TYPES.keys():
        for device_number in range(3):
            topic = f"{TOPIC}/{device_type}_{device_number}"
            client.publish(topic, payload="", retain=True)
            print(f"Cleared retained message for {topic}")


async def main():
    client = mqtt.Client()
    client.connect(BROKER, PORT, 60)

    clear_retained_messages(client)

    tasks = [
        asyncio.create_task(publish_device_data(client, device_type, device_number))
        for device_type in DEVICE_TYPES.keys()
        for device_number in range(random.randint(0, 3))
    ]

    await asyncio.gather(*tasks)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Stopping emulator.")
