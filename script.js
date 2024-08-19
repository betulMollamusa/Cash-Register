let price = 1.87; // Ürünün fiyatı
let cid = [ // Kasa çekmecesindeki para birimleri ve miktarları
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.1],
  ['QUARTER', 0.25],
  ['ONE', 1],
  ['FIVE', 5],
  ['TEN', 10],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
];

const displayChangeDue = document.getElementById('change-due'); // Değişim ekranı
const cash = document.getElementById('cash'); // Nakit giriş alanı
const purchaseBtn = document.getElementById('purchase-btn'); // Satın alma butonu
const priceScreen = document.getElementById('price-screen'); // Ürün fiyat ekranı
const cashDrawerDisplay = document.getElementById('cash-drawer-display'); // Kasa çekmecesi ekranı

// Sonuçları formatlayıp ekranda gösterir
const formatResults = (status, change) => {
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
  change.map(
    money => (displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
  );
  return;
};

// Kasa kontrolünü yapar ve değişim miktarını hesaplar
const checkCashRegister = () => {
  if (Number(cash.value) < price) {
    alert('Müşterinin ürünü satın almak için yeterli parası yok');
    cash.value = ''; // Nakit girişini temizle
    return;
  }

  if (Number(cash.value) === price) {
    displayChangeDue.innerHTML =
      '<p>No change due - müşteri tam para verdi</p>';
    cash.value = ''; // Nakit girişini temizle
    return;
  }

  let changeDue = Number(cash.value) - price; // Geri verilmesi gereken değişim
  let reversedCid = [...cid].reverse(); // Kasa çekmecesindeki paraları tersten sıralar
  let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01]; // Para birimlerinin değerleri
  let result = { status: 'OPEN', change: [] }; // Sonuç nesnesi
  let totalCID = parseFloat(
    cid
      .map(total => total[1])
      .reduce((prev, curr) => prev + curr)
      .toFixed(2)
  );

  if (totalCID < changeDue) {
    return (displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
  }

  if (totalCID === changeDue) {
    result.status = "CLOSED"; // Kasa kapalı
  }

  for (let i = 0; i <= reversedCid.length; i++) {
    if (changeDue >= denominations[i] && changeDue > 0) {
      let count = 0;
      let total = reversedCid[i][1];
      while (total > 0 && changeDue >= denominations[i]) {
        total -= denominations[i];
        changeDue = parseFloat((changeDue -= denominations[i]).toFixed(2));
        count++;
      }
      if (count > 0) {
        result.change.push([reversedCid[i][0], count * denominations[i]]);
      }
    }
  }
  if (changeDue > 0) {
    return (displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
  }

  formatResults(result.status, result.change); // Sonuçları formatla ve ekranda göster
  updateUI(result.change); // Kullanıcı arayüzünü güncelle
};

// Sonuçları kontrol eder ve geri ödeme hesaplar
const checkResults = () => {
  if (!cash.value) {
    return;
  }
  checkCashRegister();
};

// Kullanıcı arayüzünü günceller
const updateUI = change => {
  const currencyNameMap = { // Para birimlerinin isimleri
    PENNY: 'Pennies',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    'ONE HUNDRED': 'Hundreds'
  };
  if (change) {
    change.forEach(changeArr => {
      const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
      targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
    });
  }

  cash.value = ''; // Nakit girişini temizle
  priceScreen.textContent = `Total: $${price}`; // Ürün fiyatını ekranda göster
  cashDrawerDisplay.innerHTML = `<p><strong>Change in drawer:</strong></p>
    ${cid
      .map(money => `<p>${currencyNameMap[money[0]]}: $${money[1]}</p>`)
      .join('')}  
  `;
};

purchaseBtn.addEventListener('click', checkResults); // Satın alma butonuna tıklama olayını dinle

cash.addEventListener('keydown', e => { // Nakit girişinde Enter tuşuna basıldığında işlem yapar
  if (e.key === 'Enter') {
    checkResults();
  }
});

updateUI(); // Sayfa yüklendiğinde arayüzü güncelle
