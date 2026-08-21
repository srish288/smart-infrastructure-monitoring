require("dotenv").config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();

app.use(express.json());

const PORT = 5000;

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});
const ALERT_THRESHOLDS = JSON.parse(
    process.env.ALERT_THRESHOLDS || "{}"
);

function detectFaults(reading) {
    const faults = [];

    if (
        ALERT_THRESHOLDS.overvoltage !== undefined &&
        reading.voltage > ALERT_THRESHOLDS.overvoltage
    ) {
        faults.push({
            type: "OVERVOLTAGE",
            severity: "HIGH",
            message: `Voltage is too high: ${reading.voltage}V`
        });
    }

    if (
        ALERT_THRESHOLDS.undervoltage !== undefined &&
        reading.voltage < ALERT_THRESHOLDS.undervoltage
    ) {
        faults.push({
            type: "UNDERVOLTAGE",
            severity: "HIGH",
            message: `Voltage is too low: ${reading.voltage}V`
        });
    }

    if (
        ALERT_THRESHOLDS.overcurrent !== undefined &&
        reading.current > ALERT_THRESHOLDS.overcurrent
    ) {
        faults.push({
            type: "OVERCURRENT",
            severity: "CRITICAL",
            message: `Current is too high: ${reading.current}A`
        });
    }

    if (
        ALERT_THRESHOLDS.overtemperature !== undefined &&
        reading.temperature > ALERT_THRESHOLDS.overtemperature
    ) {
        faults.push({
            type: "OVERTEMPERATURE",
            severity: "HIGH",
            message: `Temperature is too high: ${reading.temperature}°C`
        });
    }

    if (reading.sensorStatus === "FAILURE") {
        faults.push({
            type: "SENSOR_FAILURE",
            severity: "WARNING",
            message: "Sensor failure detected"
        });
    }

    // Lamp failure:
    // Lamp is supposed to be ON but electrical output
    // and illumination are both abnormally low.
    if (
        reading.lampState === "ON" &&
        reading.current < ALERT_THRESHOLDS.lampFailureCurrent &&
        reading.illumination < ALERT_THRESHOLDS.lampFailureIllumination
    ) {
        faults.push({
            type: "LAMP_FAILURE",
            severity: "CRITICAL",
            message: "Possible lamp failure detected"
        });
    }

    return faults;
}
// Test route
app.get("/", (req, res) => {
    res.send("Smart Infrastructure Backend is running!");
});

// Get all streetlights
app.get("/api/streetlights", async (req, res) => {
    try {
        const streetlights = await prisma.streetlight.findMany();

        res.json(streetlights);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch streetlights"
        });
    }
});

// Get one streetlight by ID
app.get("/api/streetlights/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const streetlight = await prisma.streetlight.findUnique({
            where: {
                id: id
            }
        });

        if (!streetlight) {
            return res.status(404).json({
                error: "Streetlight not found"
            });
        }

        res.json(streetlight);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch streetlight"
        });
    }
});

// Add a streetlight
app.post("/api/streetlights", async (req, res) => {
    try {
        const { name, location, status } = req.body;

        const streetlight = await prisma.streetlight.create({
            data: {
                name,
                location,
                status: status || "ACTIVE"
            }
        });

        res.status(201).json(streetlight);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create streetlight"
        });
    }
});
// Update a streetlight
app.put("/api/streetlights/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, location, status } = req.body;

        const streetlight = await prisma.streetlight.update({
            where: {
                id: id
            },
            data: {
                name,
                location,
                status
            }
        });

        res.json(streetlight);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update streetlight"
        });
    }
});
// Delete a streetlight
app.delete("/api/streetlights/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const streetlight = await prisma.streetlight.delete({
            where: {
                id: id
            }
        });

        res.json({
            message: "Streetlight deleted successfully",
            streetlight: streetlight
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete streetlight"
        });
    }
});
// ==================== DEVICE APIs ====================

// Get all devices
app.get("/api/devices", async (req, res) => {
    try {
        const devices = await prisma.device.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(devices);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch devices"
        });
    }
});

// Get one device
app.get("/api/devices/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                error: "Invalid device ID"
            });
        }

        const device = await prisma.device.findUnique({
            where: {
                id: id
            }
        });

        if (!device) {
            return res.status(404).json({
                error: "Device not found"
            });
        }

        res.json(device);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch device"
        });
    }
});

// Create a device
app.post("/api/devices", async (req, res) => {
    try {
        const {
            deviceId,
            name,
            latitude,
            longitude,
            source
        } = req.body;

        if (
            !deviceId ||
            !name ||
            latitude === undefined ||
            longitude === undefined ||
            !source
        ) {
            return res.status(400).json({
                error: "deviceId, name, latitude, longitude and source are required"
            });
        }

        if (!["HARDWARE", "SIMULATOR"].includes(source)) {
            return res.status(400).json({
                error: "source must be HARDWARE or SIMULATOR"
            });
        }

        const device = await prisma.device.create({
            data: {
                deviceId,
                name,
                latitude: Number(latitude),
                longitude: Number(longitude),
                source
            }
        });

        res.status(201).json(device);
    } catch (error) {
        console.error(error);

        if (error.code === "P2002") {
            return res.status(409).json({
                error: "Device ID already exists"
            });
        }

        res.status(500).json({
            error: "Failed to create device"
        });
    }
});

// Update a device
app.put("/api/devices/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                error: "Invalid device ID"
            });
        }

        const {
            deviceId,
            name,
            latitude,
            longitude,
            source,
            status
        } = req.body;

        if (
            source !== undefined &&
            !["HARDWARE", "SIMULATOR"].includes(source)
        ) {
            return res.status(400).json({
                error: "source must be HARDWARE or SIMULATOR"
            });
        }

        if (
            status !== undefined &&
            !["ONLINE", "OFFLINE", "HEALTHY", "WARNING", "CRITICAL"].includes(status)
        ) {
            return res.status(400).json({
                error: "Invalid device status"
            });
        }

        const device = await prisma.device.update({
            where: {
                id: id
            },
            data: {
                ...(deviceId !== undefined && { deviceId }),
                ...(name !== undefined && { name }),
                ...(latitude !== undefined && { latitude: Number(latitude) }),
                ...(longitude !== undefined && { longitude: Number(longitude) }),
                ...(source !== undefined && { source }),
                ...(status !== undefined && { status })
            }
        });

        res.json(device);
    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                error: "Device not found"
            });
        }

        if (error.code === "P2002") {
            return res.status(409).json({
                error: "Device ID already exists"
            });
        }

        res.status(500).json({
            error: "Failed to update device"
        });
    }
});

// Delete a device
app.delete("/api/devices/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                error: "Invalid device ID"
            });
        }

        const device = await prisma.device.delete({
            where: {
                id: id
            }
        });

        res.json({
            message: "Device deleted successfully",
            device
        });
    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                error: "Device not found"
            });
        }

        res.status(500).json({
            error: "Failed to delete device"
        });
    }
});
// Receive telemetry reading
app.post("/api/readings", async (req, res) => {
    try {
        const {
            deviceId,
            timestamp,
            source,
            voltage,
            current,
            power,
            illumination,
            lampState,
            temperature,
            sensorStatus
        } = req.body;

        // Basic validation
        if (
            !deviceId ||
            !timestamp ||
            !source ||
            voltage === undefined ||
            current === undefined ||
            power === undefined ||
            illumination === undefined ||
            !lampState ||
            temperature === undefined ||
            !sensorStatus
        ) {
            return res.status(400).json({
                error: "Missing required telemetry fields"
            });
        }

        // Validate source
        if (!["HARDWARE", "SIMULATOR"].includes(source)) {
            return res.status(400).json({
                error: "Invalid source"
            });
        }

        // Validate lamp state
        if (!["ON", "OFF"].includes(lampState)) {
            return res.status(400).json({
                error: "Invalid lampState"
            });
        }

        // Validate sensor status
        if (!["OK", "FAILURE"].includes(sensorStatus)) {
            return res.status(400).json({
                error: "Invalid sensorStatus"
            });
        }

        // Validate numeric values
        if (
            typeof voltage !== "number" ||
            typeof current !== "number" ||
            typeof power !== "number" ||
            typeof illumination !== "number" ||
            typeof temperature !== "number"
        ) {
            return res.status(400).json({
                error: "Telemetry numeric fields must be numbers"
            });
        }

        // Validate timestamp
        const readingTime = new Date(timestamp);

        if (isNaN(readingTime.getTime())) {
            return res.status(400).json({
                error: "Invalid timestamp"
            });
        }

        // Check device exists
        const device = await prisma.device.findUnique({
            where: {
                deviceId: deviceId
            }
        });

        if (!device) {
            return res.status(404).json({
                error: "Device not found"
            });
        }

        // Store telemetry
        const reading = await prisma.telemetryReading.create({
            data: {
                deviceId,
                timestamp: readingTime,
                source,
                voltage,
                current,
                power,
                illumination,
                lampState,
                temperature,
                sensorStatus
            }
        });

        // Update device
        const updatedDevice = await prisma.device.update({
            where: {
                deviceId
            },
            data: {
                lastSeen: readingTime,
                status: "ONLINE"
            }
        });
// Detect faults
const faults = detectFaults({
    voltage,
    current,
    illumination,
    lampState,
    temperature,
    sensorStatus
});

// Create FaultEvents and Alerts
const createdAlerts = [];

for (const fault of faults) {
    await prisma.faultEvent.create({
        data: {
            deviceId,
            type: fault.type,
            message: fault.message,
            timestamp: readingTime
        }
    });

    const alert = await prisma.alert.create({
        data: {
            deviceId,
            type: fault.type,
            severity: fault.severity,
            message: fault.message,
            timestamp: readingTime
        }
    });

    createdAlerts.push(alert);
}
        res.status(201).json({
    message: "Telemetry received successfully",
    reading,
    device: updatedDevice,
    faults,
    alerts: createdAlerts
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to process telemetry"
        });
    }
});
// Get all alerts
app.get("/api/alerts", async (req, res) => {
    try {
        const alerts = await prisma.alert.findMany({
            orderBy: {
                timestamp: "desc"
            }
        });

        res.json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch alerts"
        });
    }
});

// Get one alert
app.get("/api/alerts/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const alert = await prisma.alert.findUnique({
            where: {
                id
            }
        });

        if (!alert) {
            return res.status(404).json({
                error: "Alert not found"
            });
        }

        res.json(alert);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch alert"
        });
    }
});

// Acknowledge alert
app.put("/api/alerts/:id/acknowledge", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const alert = await prisma.alert.update({
            where: {
                id
            },
            data: {
                acknowledged: true
            }
        });

        res.json(alert);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to acknowledge alert"
        });
    }
});

// Resolve alert
app.put("/api/alerts/:id/resolve", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const alert = await prisma.alert.update({
            where: {
                id
            },
            data: {
                resolved: true
            }
        });

        res.json(alert);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to resolve alert"
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});