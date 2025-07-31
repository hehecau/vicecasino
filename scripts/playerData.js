import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js';
import { getDatabase, ref, get, set, update } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyAMWTpT8RJjpFP_n9wtl7bY88hmLoMHKE4",
  authDomain: "vicecasino-73307.firebaseapp.com",
  databaseURL: "https://vicecasino-73307-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vicecasino-73307",
  storageBucket: "vicecasino-73307.appspot.com",
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
    console.error("Error getting balance:", error.message);
    throw new Error(`Nemožno získať zostatok: ${error.message}`);
  }
}

async function depositMoney(characterId, amount) {
  if (amount < 5000) {
    throw new Error("Minimální částka pro vklad je 5 000 Kč.");
  }
  const playerRef = ref(db, `players/${characterId}`);
  const currentBalance = await getPlayerBalance(characterId);
  await update(playerRef, { balance: currentBalance + amount });
  return true;
}

async function withdrawMoney(characterId, amount) {
  if (amount < 20000) {
    throw new Error("Minimální částka pro výběr je 20 000 Kč.");
  }
  const playerRef = ref(db, `players/${characterId}`);
  const currentBalance = await getPlayerBalance(characterId);
  if (currentBalance < amount) {
    throw new Error("Nedostatečný zůstatek pro výběr.");
  }
  await update(playerRef, { balance: currentBalance - amount });
  return true;
}

function updateNavbarBalance(characterId) {
  const balanceDisplay = document.getElementById('navbarBalance');
  if (!balanceDisplay) return;
  if (characterId && /^\d+$/.test(characterId)) {
    getPlayerBalance(characterId)
      .then(balance => balanceDisplay.textContent = `${balance} Kč`)
      .catch(() => balanceDisplay.textContent = 'Chyba');
  } else {
    balanceDisplay.textContent = '0 Kč';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  let characterId = urlParams.get('characterId')?.trim();
  if (characterId && /^\d+$/.test(characterId)) {
    localStorage.setItem('characterId', characterId);
  } else {
    characterId = localStorage.getItem('characterId')?.trim();
  }

  if (characterId) {
    updateNavbarBalance(characterId);
  }
});

export { getPlayerBalance, depositMoney, withdrawMoney };
