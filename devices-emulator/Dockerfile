FROM python:3.13.1-alpine

WORKDIR /app

COPY . .

RUN pip install poetry

RUN poetry install

CMD ["poetry", "run", "python", "iot_devices_emulator.py"]