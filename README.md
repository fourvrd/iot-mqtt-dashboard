# ⚡ iot-mqtt-dashboard

Panel wyświetlający dane oraz statusy urządzeń IoT, które publikują informacje do brokera MQTT.

## 🛠️ Tech Stack

**Dashboard:**

- Framework: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- Bundler: [Vite](https://vitejs.dev/)
- Stylizacja: [TailwindCSS](https://tailwindcss.com/)

**Broker MQTT:**

- [Eclipse Mosquitto](https://mosquitto.org/)

**Emulator urządzeń:**

- [Python](https://www.python.org/) + [Poetry](https://python-poetry.org/)

**Konteneryzacja:**

- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)

## 📦 Deployment

1. Sklonuj repozytorium i wejdź do niego:

   ```bash
   git clone https://github.com/fourvrd/iot-mqtt-dashboard.git
   cd iot-mqtt-dashboard
   ```

2. Uruchom wszystkie skonteneryzowane elementy aplikacji w tle:
   ```bash
   docker compose up -d
   ```
3. Aby zatrzymać kontenery i usunąć ich woluminy (np. bazę danych brokera MQTT):
   ```bash
   docker compose down -v
   ```

## 🤔 Jak to działa?

Panel łączy się do brokera MQTT i nasłuchuje na topiku `iot_devices/#`. Jeśli znajdzie tam jakieś topiki niżej w hierarchii, odczytuje ich wartości.

Wartością każdego topica powinien być JSON o ustandaryzowanej strukturze:

- `mac_addr`: adres MAC urządzenia
- `device_type`: typ urządzenia
- `battery_level`: poziom baterii
- `values`: lista zwracanych wartości
- `timestamp`: timestamp z datą ostatniej aktualizacji stanu urządzenia w formacie ISO 8601, UTC

Jeśli `device_type` odpowiada któremuś z typów urządzeń w pliku `/dashboard/src/mocks/device_types.json`, urządzeniu przypisywane jest odpowiednie zdjęcie poglądowe, nazwa, oraz lista oczekiwanych wartości wraz z ich jednostkami. Następnie urzązdenie wyświetlane jest w panelu w formie karty.

W tle pracuje również emulator urządzeń IoT napisany w Pythonie, który publikuje losową ilość każdego z predefiniowanych typów urządzeń (od 1 do 3 urządzeń jednego typu), a następnie asynchronicznie odświeża zwracane przez nie wartości (z pominięciem adresów MAC) w losowym interwale czasowym.

## 📖 Problemy i sposoby ich rozwiązania za pomocą frameworka React

- #### Połączenie się z brokerem MQTT przy załadowaniu strony oraz poinformowanie użytkownika o statusie połączenia

  - Wykorzystanie hooka `useEffect` pozwala na nawiązanie połączenia raz, podczas załadowania aplikacji, jeśli nie wpiszemy niczego w dependency array
  - Wykorzystanie hooka `useState` pozwala na dynamiczną zmianę statusu połączenia oraz wyświetlenie jej użytkownikowi bez konieczności przeładowania strony

- #### Używanie jednego klienta MQTT dla wszystkich podstron aplikacji bez konieczności zrywania połączenia przy każdym przejściu

  - Wykorzystanie hooka `useContext` pozwala na utworzenie kontekstu, w którym umieścimy utworzonego klienta MQTT, który będzie współdzielony przez wszystkie strony
  - Aby jeszcze bardziej uprościć sobie pracę, możemy napisać własnego hooka, nazwać go np. `useMqtt` i kazać mu pobierać klienta z kontekstu, bez konieczności pisania tego samego kodu na każdej z podstron wykorzystujących MQTT.

- #### Dynamiczne miganie ramek kart, sygnalizujące aktualizację stanu danego urządzenia

  - Do tego również możemy użyć wszechstronnych hooków `useState`, `useRef` oraz `useEffect`:\

  ```typescript
  useEffect(() => {
    if (
      previousDataRef.current &&
      previousDataRef.current !== brokerData?.message
    ) {
      setFreshlyUpdated(true);
      setTimeout(() => setFreshlyUpdated(false), 1000);
    }
    previousDataRef.current = brokerData?.message || null;
  }, [brokerData]);
  ```

  Jeśli dane z brokera MQTT będą się różniły od tych wyświetlanych obecnie, stan `freshlyUpdated` zostanie zmieniony na `true` na okres jednej sekundy. W tym czasie, dzięki instrukcji warunkowej, zmieni się również kolor ramki karty.
