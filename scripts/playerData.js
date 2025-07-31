import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js';
import { getDatabase, ref, get, set, update } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyAMWTpT8RJjpFP_n9wtl7bY88hmLoMHKE4",
  authDomain: "vicecasino-73307.firebaseapp.com",
  databaseURL: "https://vicecasino-73307-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vicecasino-73307",
  storageBucket: "vicecasino-73307.firebasestorage.app",
  messagingSenderId: "270867838529",
  appId: "1:270867838529:web:407b5d229e47d3d16278c0",
  measurementId: "G-VJMZKH923M"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function getPlayerBalance(characterId) {
  try {
    const playerRef = ref(db, `players/${characterId}`);
    const snapshot = await get(playerRef);
    if (snapshot.exists()) {
      return snapshot.val().balance;
    } else {
      await set(playerRef, { balance: 0, characterId });
      return 0;
    }
  } catch (error) {
    console.error("Error getting balance:", error.message, error.code);
    throw new Error(`Failed to get balance: ${error.message}`);
  }
}

async function depositMoney(characterId, amount) {
  try {
    if (amount < 5000) {
      alert("Minimální částka pro vklad je 5 000 Kč.");
      return false;
    }
    const playerRef = ref(db, `players/${characterId}`);
    const currentBalance = await getPlayerBalance(characterId);
    if (currentBalance === null) return false;

    await update(playerRef, { balance: currentBalance + amount });
    return true;
  } catch (error) {
    console.error("Error depositing money:", error.message, error.code);
    throw new Error(`Failed to deposit money: ${error.message}`);
  }
}

async function withdrawMoney(characterId, amount) {
  try {
    if (amount < 20000) {
      alert("Minimální částka pro výběr je 20 000 Kč.");
      return false;
    }
    const playerRef = ref(db, `players/${characterId}`);
    const currentBalance = await getPlayerBalance(characterId);
    if (currentBalance === null) return false;

    if (currentBalance < amount) {
      alert("Nedostatečný zůstatek pro výběr.");
      return false;
    }

    await update(playerRef, { balance: currentBalance - amount });
    return true;
  } catch (error) {
    console.error("Error withdrawing money:", error.message, error.code);
    throw new Error(`Failed to withdraw money: ${error.message}`);
  }
}

export { getPlayerBalance, depositMoney, withdrawMoney };