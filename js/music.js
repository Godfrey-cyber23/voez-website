// Payment modal functionality
let currentItem = {};

// Open payment modal and populate with item details
function openPaymentModal(type, name, price, id) {
  currentItem = { type, name, price, id };

  document.getElementById('modalTitle').textContent = `Purchase ${type === 'song' ? 'Song' : 'Album'}`;
  document.getElementById('itemName').textContent = name;
  document.getElementById('itemPrice').textContent = price.toFixed(2);

  // Reset fields
  document.querySelectorAll('input[name="payment"]').forEach(el => el.checked = false);
  document.querySelector('input[value="mobile_money"]').checked = true;
  document.getElementById('network').value = "";
  document.getElementById('mobileNumber').value = "";
  togglePaymentFields();

  document.getElementById('paymentModal').style.display = 'flex';
}

// Close modal
function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
}

// Show/hide fields based on selected payment method
function togglePaymentFields() {
  const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
  const mobileFields = document.getElementById('mobileMoneyFields');

  mobileFields.style.display = selectedMethod === 'mobile_money' ? 'block' : 'none';
}

// Handle payment processing
function processPayment() {
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  if (!paymentMethod) {
    alert("Please select a payment method.");
    return;
  }

  if (paymentMethod === 'mobile_money') {
    const network = document.getElementById('network').value;
    const number = document.getElementById('mobileNumber').value.trim();

    if (!network || !number) {
      alert("Please select a mobile money network and enter your mobile number.");
      return;
    }

    // Validate number (basic check for 9 or 10 digits)
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(number)) {
      alert("Please enter a valid mobile number.");
      return;
    }

    // Simulate Mobile Money processing
    alert(`You will receive a prompt to enter your ${network.toUpperCase()} Mobile Money PIN shortly.`);
    console.log(`Initiating mobile money payment via ${network} for number ${number}...`);
  } 
  else if (paymentMethod === 'card') {
    // Simulate card gateway
    alert("Redirecting to card payment gateway...");
  } 
  else if (paymentMethod === 'paypal') {
    // Simulate PayPal redirect
    alert("Redirecting to PayPal...");
  }

  // Simulate processing
  setTimeout(() => {
    alert(`Payment successful! ${currentItem.name} is now unlocked.`);
    closePaymentModal();
    // TODO: Unlock content via API/backend
  }, 1500);
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target === document.getElementById('paymentModal')) {
    closePaymentModal();
  }
};

// Audio player controls
document.querySelectorAll('.btn-play').forEach(button => {
  button.addEventListener('click', function () {
    const audio = this.parentElement.nextElementSibling;
    const icon = this.querySelector('i');

    if (audio.paused) {
      document.querySelectorAll('audio').forEach(a => a.pause()); // Stop others
      document.querySelectorAll('.btn-play i').forEach(i => i.className = 'fas fa-play');

      audio.play();
      icon.className = 'fas fa-pause';
    } else {
      audio.pause();
      icon.className = 'fas fa-play';
    }
  });
});
