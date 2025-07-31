import { getPlayerBalance, depositMoney, withdrawMoney } from './playerData.js';

const balanceDisplay = document.getElementById('balance');
const depositButton = document.getElementById('depositButton');
const withdrawButton = document.getElementById('withdrawButton');
const inputDeposit = document.getElementById('inputDeposit');
const inputWithdraw = document.getElementById('inputWithdraw');
const alertContainer = document.getElementById('alertContainer');

function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = 'alert';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertContainer.innerHTML = '';
  alertContainer.appendChild(alert);
  setTimeout(() => alert.classList.remove('show'), 5000);
}

const urlParams = new URLSearchParams(window.location.search);
const characterId = urlParams.get('characterId')?.trim() || localStorage.getItem('characterId')?.trim();
console.log('Character ID:', characterId);

if (characterId && /^\d+$/.test(characterId)) {
  getPlayerBalance(characterId)
    .then(balance => {
      balanceDisplay.textContent = `${balance} Kč`;
      depositButton.disabled = false;
      withdrawButton.disabled = false;
    })
    .catch(error => {
      console.error('Balance fetch error:', error);
      balanceDisplay.textContent = 'Chyba při načítání zůstatku';
      showAlert('Chyba při načítání zůstatku', 'danger');
      depositButton.disabled = true;
      withdrawButton.disabled = true;
    });
} else {
  showAlert('Chyba 5 pri načítaní zůstatku', 'danger');
  balanceDisplay.textContent = '0 Kč';
  depositButton.disabled = true;
  withdrawButton.disabled = true;
}

depositButton.addEventListener('click', async () => {
  const amount = parseInt(inputDeposit.value);
  if (!characterId || !/^\d+$/.test(characterId)) {
    showAlert('Chyba 5 pri načítaní zůstatku', 'danger');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    showAlert('Zadejte platnou částku', 'danger');
    return;
  }
  try {
    const success = await depositMoney(characterId, amount);
    if (success) {
      showAlert('Vklad proběhl úspěšně!', 'success');
      const balance = await getPlayerBalance(characterId);
      balanceDisplay.textContent = `${balance} Kč`;
      inputDeposit.value = '';
    }
  } catch (error) {
    console.error('Deposit error:', error);
    showAlert(`Chyba při vkladu peněz: ${error.message}`, 'danger');
  }
});

withdrawButton.addEventListener('click', async () => {
  const amount = parseInt(inputWithdraw.value);
  if (!characterId || !/^\d+$/.test(characterId)) {
    showAlert('Chyba 5 pri načítaní zůstatku', 'danger');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    showAlert('Zadejte platnou částku', 'danger');
    return;
  }
  try {
    const success = await withdrawMoney(characterId, amount);
    if (success) {
      showAlert('Výběr proběhl úspěšně!', 'success');
      const balance = await getPlayerBalance(characterId);
      balanceDisplay.textContent = `${balance} Kč`;
      inputWithdraw.value = '';
    }
  } catch (error) {
    console.error('Withdrawal error:', error);
    showAlert(`Chyba při výběru peněz: ${error.message}`, 'danger');
  }
});