function getCharacterID() {
    const params = new URLSearchParams(window.location.search);
    return params.get("characterID");
}
  const characterID = getCharacterID();

  if (!characterID) {
    alert("Nemožno nájsť charID.");
  } else {
    const moneyRef = db.ref("players/" + characterID + "/money");

    moneyRef.once("value").then((snapshot) => {
      let money = snapshot.val();
      if (money === null) {
        money = 1500; 
        moneyRef.set(money);
      }
      document.getElementById("playerMoney").innerText = money + " $";
    });

    function spendMoney(amount) {
      moneyRef.once("value").then((snapshot) => {
        let current = snapshot.val() || 0;
        let updated = Math.max(current - amount, 0);
        moneyRef.set(updated);
        document.getElementById("playerMoney").innerText = updated + " $";
      });
    }
}
