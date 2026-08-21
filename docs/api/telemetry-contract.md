# Smart Infrastructure Monitoring
# Telemetry Contract

## 1. Purpose

This document defines the canonical telemetry format used by:

- ESP32 hardware
- Streetlight simulator
- Backend
- ML service

Hardware and simulator MUST use the same telemetry structure.

---

## 2. Telemetry Payload

```json
{
  "deviceId": "SL-001",
  "timestamp": "2026-08-21T10:00:00Z",
  "source": "SIMULATOR",
  "voltage": 231.4,
  "current": 0.32,
  "power": 74.05,
  "illumination": 820,
  "lampState": "ON",
  "temperature": 31.2,
  "sensorStatus": "OK"
}