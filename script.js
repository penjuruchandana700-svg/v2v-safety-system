const speedAInput = document.getElementById("vehicleASpeed");
const speedBInput = document.getElementById("vehicleBSpeed");
const distanceInput = document.getElementById("vehicleDistance");

const speedA = document.getElementById("speedA");
const speedB = document.getElementById("speedB");
const distanceA = document.getElementById("distanceA");

const speedAValue = document.getElementById("speedAValue");
const speedBValue = document.getElementById("speedBValue");
const distanceValue = document.getElementById("distanceValue");

const relativeSpeed = document.getElementById("relativeSpeed");
const ttc = document.getElementById("ttc");

const riskCircle = document.getElementById("riskCircle");
const riskLevel = document.getElementById("riskLevel");

const statusA = document.getElementById("statusA");
const statusB = document.getElementById("statusB");

const logContainer = document.getElementById("logContainer");
const resetBtn = document.getElementById("resetBtn");


// Update simulation
function updateSimulation() {

    const vehicleASpeed = Number(speedAInput.value);
    const vehicleBSpeed = Number(speedBInput.value);
    const vehicleDistance = Number(distanceInput.value);

    // Update UI
    speedA.textContent = vehicleASpeed;
    speedB.textContent = vehicleBSpeed;

    distanceA.textContent = vehicleDistance;

    speedAValue.textContent = vehicleASpeed;
    speedBValue.textContent = vehicleBSpeed;
    distanceValue.textContent = vehicleDistance;

    /*
        Calculate relative speed.

        We assume Vehicle A is approaching Vehicle B.
        km/h -> m/s conversion:
        speed / 3.6
    */

    const relativeSpeedKmh =
        Math.max(vehicleASpeed - vehicleBSpeed, 0);

    const relativeSpeedMs =
        relativeSpeedKmh / 3.6;

    let timeToCollision;

    if (relativeSpeedMs > 0) {
        timeToCollision =
            vehicleDistance / relativeSpeedMs;
    } else {
        timeToCollision = Infinity;
    }

    relativeSpeed.textContent =
        relativeSpeedKmh.toFixed(1);

    if (timeToCollision === Infinity) {
        ttc.textContent = "∞";
    } else {
        ttc.textContent =
            timeToCollision.toFixed(2);
    }

    calculateRisk(timeToCollision);
}


// Determine collision risk
function calculateRisk(timeToCollision) {

    riskCircle.classList.remove(
        "low",
        "medium",
        "high"
    );

    if (timeToCollision === Infinity ||
        timeToCollision > 8) {

        setLowRisk();

    } else if (timeToCollision > 4) {

        setMediumRisk();

    } else {

        setHighRisk();
    }
}


// LOW risk
function setLowRisk() {

    riskCircle.style.background = "#22c55e";
    riskCircle.style.boxShadow =
        "0 0 35px rgba(34,197,94,0.6)";

    riskLevel.textContent = "LOW";

    statusA.textContent = "Connected";
    statusB.textContent = "Connected";

    statusA.style.color = "#22c55e";
    statusB.style.color = "#22c55e";
}


// MEDIUM risk
function setMediumRisk() {

    riskCircle.style.background = "#f59e0b";
    riskCircle.style.boxShadow =
        "0 0 35px rgba(245,158,11,0.6)";

    riskLevel.textContent = "MEDIUM";

    statusA.textContent = "⚠ Warning";
    statusB.textContent = "⚠ Warning";

    statusA.style.color = "#f59e0b";
    statusB.style.color = "#f59e0b";
}


// HIGH risk
function setHighRisk() {

    riskCircle.style.background = "#ef4444";
    riskCircle.style.boxShadow =
        "0 0 45px rgba(239,68,68,0.8)";

    riskLevel.textContent = "HIGH";

    statusA.textContent = "🚨 COLLISION RISK";
    statusB.textContent = "🚨 COLLISION RISK";

    statusA.style.color = "#ef4444";
    statusB.style.color = "#ef4444";
}


// Add event to log
function addLog(message, type = "") {

    const log = document.createElement("div");

    log.classList.add("log-item");

    if (type === "warning") {
        log.classList.add("warning-log");
    }

    if (type === "danger") {
        log.classList.add("danger-log");
    }

    const time = new Date().toLocaleTimeString();

    log.textContent =
        `[${time}] ${message}`;

    logContainer.prepend(log);

    // Keep only latest 8 messages
    while (logContainer.children.length > 8) {
        logContainer.removeChild(
            logContainer.lastChild
        );
    }
}


// Slider events

speedAInput.addEventListener("input", () => {

    updateSimulation();

    addLog(
        `Vehicle A speed updated to ${speedAInput.value} km/h`
    );
});


speedBInput.addEventListener("input", () => {

    updateSimulation();

    addLog(
        `Vehicle B speed updated to ${speedBInput.value} km/h`
    );
});


distanceInput.addEventListener("input", () => {

    updateSimulation();

    addLog(
        `Vehicle distance updated to ${distanceInput.value} meters`
    );
});


// Reset
resetBtn.addEventListener("click", () => {

    speedAInput.value = 60;
    speedBInput.value = 40;
    distanceInput.value = 40;

    updateSimulation();

    addLog("Simulation reset successfully.");
});


// Automatic monitoring
setInterval(() => {

    const vehicleASpeed = Number(speedAInput.value);
    const vehicleBSpeed = Number(speedBInput.value);
    const vehicleDistance = Number(distanceInput.value);

    const relativeSpeed =
        Math.max(vehicleASpeed - vehicleBSpeed, 0);

    const relativeSpeedMs =
        relativeSpeed / 3.6;

    if (relativeSpeedMs === 0) {
        return;
    }

    const collisionTime =
        vehicleDistance / relativeSpeedMs;

    if (collisionTime <= 4) {

        addLog(
            "🚨 HIGH COLLISION RISK DETECTED!",
            "danger"
        );

    } else if (collisionTime <= 8) {

        addLog(
            "⚠ Vehicle proximity warning.",
            "warning"
        );
    }

}, 5000);


// Initial state
updateSimulation();

addLog("V2V communication established.");
addLog("Vehicle A and Vehicle B detected.");
