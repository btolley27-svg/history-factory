// =======================
// ELEMENTS
// =======================
const upgradeList = document.getElementById("upgradeList");
const upgradeInfo = document.getElementById("upgradeInfo");
const machinePanelA = document.getElementById("machineA");
const machinePanelS = document.getElementById("machineS");
const machinePanelD = document.getElementById("machineD");
const machinePanelF = document.getElementById("machineF");
const lightA = document.getElementById("lightA");
const lightS = document.getElementById("lightS");
const lightD = document.getElementById("lightD");
const lightF = document.getElementById("lightF");
const moneyText = document.getElementById("money");
const upgrades = [
    {
        name: "Stone Tools",
        cost: 50,
        description: "More durable tools for harvesting. Farm payouts increased",
        purchased: false,

        effect: function () {
            machineA.reward += 5;
        }
    },

    {
        name: "Steam engine",
        cost: 100,
        description: "Converts heat to mechanical energy. All penalties reduced",
        eraRequired: 1,

        purchased: false,

        effect: function () {
            eras.forEach(e => {
                e.penalty -= 1;
            });
        }
    },

    {
        name: "Automated conveyor system",
        cost: 250,
        description: "Increases efficiency. CNC mill speed increased, all rewards increased",

        purchased: false,

        eraRequired: 2,

        effect: function () {

            machines.forEach(machine => {
                machine.reward *= 2;
            });
            MachineD.pattern = [300,300];
            

        }
        
    },

    {
        name: "AI-powered automation",
        cost: 1000,
        description: "AI now runs all machinery, causing all humans to become obsolete. Machines now trigger automatically, rewards X100.",

        purchased: false,
        eraRequired: 3,

        effect: function () {

            machines.forEach(machine => {
                machine.reward *= 100;
            });
           machines.forEach(machine => {
    machine.auto = true;
});

        }
        
    }
    
];
function renderUpgrades() {

    upgradeList.innerHTML = "";
upgrades.forEach(upgrade => {

    if (upgrade.purchased) return;

    // Era lock
    if (upgrade.eraRequired > era) return;

    const button = document.createElement("button");

    button.innerHTML =
        `<b>${upgrade.name}</b><br>
         Cost: $${upgrade.cost}<br>
         ${upgrade.description}`;

    button.onclick = function () {

        if (money >= upgrade.cost) {

            money -= upgrade.cost;

            upgrade.purchased = true;

            upgrade.effect();

            updateMoney();

            renderUpgrades();

        }

    };

    upgradeList.appendChild(button);
console.log(upgrades);
console.log(upgradeList);
});
}
// =======================
// GAME STATE
// =======================

let money = 0;
let era = 0;

const eras = [
    {
        name: "Agricultural Revolution",
        bg: "#916F41",
        speedMultiplier: 1,
        rewardMultiplier: 1,
        fact: "This era used early farming techniques and simple hand tools.",
        penalty: 5

    },
    {
        name: "Industrial Revolution",
        bg: "#a8b86c",
        speedMultiplier: 1.2,
        rewardMultiplier: 1.2,
        fact: "Oil and electricity replaced coal and steam. This era expanded communication and transportation with the expansion of railroads and the invention of the telegraph.",
        penalty: 6
    },
    {
        name: "Modern Day",
        bg: "#1f1f1f",
        speedMultiplier: 1.5,
        rewardMultiplier: 1.5,
        fact: "Brought automation and more digital transformation to manufacturing and industries.",
        penalty: 8
    },
    {
        name: "The Future",
        bg: "#999999",
        speedMultiplier: 2.0,
        rewardMultiplier: 2.0,
        fact: "Artificial intelligence has taken over and now runs all factories. Humans are obsolete and AI systems make massive profits.",
        penalty: 15
    },

];

function applyEra() {

    const current = eras[era];
    document.getElementById("era").classList.add("flash");
    document.querySelectorAll(".machine").forEach(m => {
    m.style.filter = "brightness(1)";
        document.getElementById("fact").textContent =
        current.fact;
        renderUpgrades();
});

if (era === 0) {
    document.body.style.filter = "sepia(0.3)";
}

if (era === 1) {
    document.body.style.filter = "contrast(1.2)";
}

if (era === 2) {
    document.body.style.filter = "brightness(0.9) saturate(1.3)";
}

if (era === 3) {
    document.body.style.color = "rgb(192 192 192)";
}


    // Change background (factory atmosphere)
    document.body.style.backgroundColor = current.bg;

    // Update UI text
    document.getElementById("era").textContent =
        "Era: " + current.name;
}
// =======================
// UPDATE MONEY UI
// =======================
function updateMoney() {
    moneyText.textContent = "Money: $" + money;
}

function flash(light, type) {

    light.classList.remove("success-flash");
    light.classList.remove("fail-flash");

    // force reflow so animation can restart
    void light.offsetWidth;

    if (type === "success") {
        light.classList.add("success-flash");
    }

    if (type === "fail") {
        light.classList.add("fail-flash");
    }
}
// =======================
// MACHINE OBJECTS
// =======================
const machineA = {
    key: "a",
    light: lightA,
    panel: machinePanelA,
    reward: 10,
      auto: false,
    active: false,
    unlocked: true,
    pattern: [1200, 1200],
    patternIndex: 0,
    speedBoost: 1
};

const machineS = {
    key: "s",
    light: lightS,
    speedBoost: 1,
    reward: 20,
      auto: false,
    panel: machinePanelS,
    active: false,
    unlocked: false, // starts locked
    pattern: [700, 1400],
    patternIndex: 0
};
    const machineD = {
    key: "d",
    light: lightD,
    speedBoost: 1,
    reward: 50,
      auto: false,
    active: false,
    panel: machinePanelD,
    unlocked: false, // starts locked
    pattern: [500, 500],
    patternIndex: 0
    };
    const machineF = {
    key: "f",
    light: lightF,
    reward: 100,
    panel: machinePanelF,
    speedBoost: 1,
      auto: false,
    active: false,
    unlocked: false, // starts locked
    pattern: [800, 300],
    patternIndex: 0
};

// Put machines in a list for easy management
const machines = [machineA, machineS, machineD, machineF];


    // Stop repeat purchases
    

// =======================
// MACHINE ENGINE
// =======================
function startMachine(machine) {

    // Skip if locked
    if (!machine.unlocked) return;

    machine.active = true;
    machine.light.classList.add("green");

    setTimeout(() => {

        if (machine.active) {

    // AUTOMATIC MACHINE
    if (machine.auto) {

        money += Math.floor(
            machine.reward * eras[era].rewardMultiplier
        );

        flash(machine.light, "success");

    } else {

        // Player missed the timing
        money -= eras[era].penalty;

        if (money < 0) {
            money = 0;
        }

        flash(machine.light, "fail");
    }

    updateMoney();
}

       

        // RESET MACHINE STATE (IMPORTANT)
        machine.active = false;
        machine.light.classList.remove("green");

        // NEXT CYCLE TIMING
        const current = eras[era];

        const delay =
            machine.pattern[machine.patternIndex]
            * current.speedMultiplier
            * (machine.speedBoost || 1);

        machine.patternIndex++;

        if (machine.patternIndex >= machine.pattern.length) {
            machine.patternIndex = 0;
        }

        setTimeout(() => {
            startMachine(machine);
        }, delay);

    }, 700);
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
money += Math.floor(machine.reward * eras[era].rewardMultiplier);

flash(machine.light, "success");

                machine.active = false;
                machine.light.classList.remove("green");

            } else {

                // WRONG TIMING
money -= eras[era].penalty;
if (money < 0) money = 0;


flash(machine.light, "fail");
            }

            updateMoney();
        }
    });
});
function checkEraChange() {

    if (era === 0 && money >= 150) {
        era = 1;
        applyEra();
    }

    if (era === 1 && money >= 500) {
        era = 2;
        applyEra();
    }

    if (era === 2 && money >= 1000) {
        era = 3;
        applyEra();
    }
}

setInterval(checkEraChange, 500);

// =======================
// UNLOCK SYSTEM (SIMPLE EXAMPLE)
// =======================
function checkUnlocks() {

    // Unlock sewing machine at $50
    if (money >= 150 && !machineS.unlocked) {
        machineS.unlocked = true;

machineS.panel.classList.remove("hidden");

startMachine(machineS);
    }

    if (money >= 500 && !machineD.unlocked) {
       machineD.unlocked = true;

machineD.panel.classList.remove("hidden");

startMachine(machineD);
    }
    if (money >= 1000 && !machineF.unlocked) {
      machineF.unlocked = true;

machineF.panel.classList.remove("hidden");

startMachine(machineF);
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
applyEra();
renderUpgrades();
console.log("SCRIPT RUNNING");
// Start first machine only
startMachine(machineA);

// Check unlocks repeatedly
setInterval(gameLoop, 500);