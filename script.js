// =======================
// ELEMENTS
// =======================
const lightA = document.getElementById("lightA");
const lightS = document.getElementById("lightS");
const moneyText = document.getElementById("money");

// =======================
// GAME STATE
// =======================
let money = 0;

// =======================
// UPDATE MONEY UI
// =======================
function updateMoney() {
    moneyText.textContent = "Money: $" + money;
}

// =======================
// MACHINE OBJECTS
// =======================
const machineA = {
    key: "a",
    light: lightA,
    reward: 10,
    active: false,
    unlocked: true,
    pattern: [1200, 1200],
    patternIndex: 0
};

const machineS = {
    key: "s",
    light: lightS,
    reward: 20,
    active: false,
    unlocked: false, // starts locked
    pattern: [700, 1400],
    patternIndex: 0
};

// Put machines in a list for easy management
const machines = [machineA, machineS];

// =======================
// MACHINE ENGINE
// =======================
function startMachine(machine) {

    // Skip if locked
    if (!machine.unlocked) return;

    machine.active = true;
    machine.light.classList.add("green");

    setTimeout(() => {

        // Missed input penalty
        if (machine.active) {
            money -= 5;
            if (money < 0) money = 0;
            updateMoney();
        }

        machine.active = false;
        machine.light.classList.remove("green");

        // Pattern timing
        const delay = machine.pattern[machine.patternIndex];

        machine.patternIndex++;
        if (machine.patternIndex >= machine.pattern.length) {
            machine.patternIndex = 0;
        }

        setTimeout(() => {
            startMachine(machine);
        }, delay);

    }, 700); // reaction window
}

// =======================
// INPUT SYSTEM
// =======================
window.addEventListener("keydown", function (event) {

    const key = event.key.toLowerCase();

    machines.forEach(machine => {

        if (!machine.unlocked) return;

        if (key === machine.key) {

            if (machine.active) {

                // SUCCESS
                money += machine.reward;

                machine.active = false;
                machine.light.classList.remove("green");

            } else {

                // WRONG TIMING
                money -= 5;
                if (money < 0) money = 0;
            }

            updateMoney();
        }
    });
});

// =======================
// UNLOCK SYSTEM (SIMPLE EXAMPLE)
// =======================
function checkUnlocks() {

    // Unlock sewing machine at $50
    if (money >= 50 && !machineS.unlocked) {
        machineS.unlocked = true;
        startMachine(machineS);
    }
}

// =======================
// GAME LOOP
// =======================
function gameLoop() {
    checkUnlocks();
}

// =======================
// START GAME
// =======================
updateMoney();

// Start first machine only
startMachine(machineA);

// Check unlocks repeatedly
setInterval(gameLoop, 500);