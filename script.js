// =======================
// ELEMENTS
// =======================
const light = document.getElementById("light");
const moneyText = document.getElementById("money");

// =======================
// GAME STATE
// =======================
let money = 0;
let active = false;

// Learnable pattern (fixed rhythm)
const pattern = [1200, 800, 1200, 800];
let patternIndex = 0;

// =======================
// UPDATE UI
// =======================
function updateMoney() {
    moneyText.textContent = "Money: $" + money;
}

// =======================
// MACHINE CYCLE
// =======================
function machineCycle() {

    // TURN ON MACHINE (GREEN LIGHT)
    active = true;
    light.classList.add("green");

    // Reaction window (player must press during this time)
    setTimeout(() => {

        // If player failed to react in time
        if (active) {
            money -= 5; // penalty
            if (money < 0) money = 0;
            updateMoney();
        }

        // TURN OFF MACHINE
        active = false;
        light.classList.remove("green");

        // Next cycle uses predictable pattern
        const delay = pattern[patternIndex];
        patternIndex = (patternIndex + 1) % pattern.length;

        setTimeout(machineCycle, delay);

    }, 700); // reaction window length

}

// =======================
// INPUT SYSTEM
// =======================
window.addEventListener("keydown", function(event) {

    if (event.key.toLowerCase() === "a") {

        if (active) {
            // SUCCESS
            money += 10;
            active = false;
            light.classList.remove("green");
        } 
        else {
            // WRONG TIMING
            money -= 5;
            if (money < 0) money = 0;
        }

        updateMoney();
    }
});

// =======================
// START GAME
// =======================
updateMoney();
machineCycle();