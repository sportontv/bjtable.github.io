document.addEventListener('DOMContentLoaded', () => {
    const seats = document.querySelectorAll('.seat');
    const assignDialog = document.getElementById('assign-dialog');
    const betDialog = document.getElementById('bet-dialog');
    const winLoseDialog = document.getElementById('win-lose-dialog');
    const dealerDialog = document.getElementById('dealer-dialog');
    const viewerNameInput = document.getElementById('viewer-name');
    const betAmountInput = document.getElementById('bet-amount');
    const assignButton = document.getElementById('assign-button');
    const placeBetButton = document.getElementById('place-bet-button');
    const winButton = document.getElementById('win-button');
    const loseButton = document.getElementById('lose-button');
    const tieButton = document.getElementById('tie-button');
    const blackjackButton = document.getElementById('blackjack-button'); // Added
    const doubleButton = document.getElementById('double-button');
    const closeButton = document.getElementById('close-button');
    const removePlayerButton = document.getElementById('remove-player-button');
    const changeBalanceButton = document.getElementById('change-balance-button');
    const newBalanceInput = document.getElementById('new-balance');
    const changeBalanceDoneButton = document.getElementById('change-balance-done-button');
    const closeBetDialogButton = document.getElementById('close-bet-dialog-button');
    const closeDealerDialogButton = document.getElementById('close-dealer-dialog-button');
    const dealerSeat = document.querySelector('.dealer');
    const dealerCountdownInput = document.getElementById('countdown-input');
    const confirmCountdownButton = document.getElementById('confirm-countdown');
    let currentSeat = null;
    let betDoubled = false;
    let countdownTimer = null;

    // Event listeners for each seat
    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            if (seat.classList.contains('assigned')) {
                const betAmount = parseInt(seat.querySelector('.bet').textContent, 10);
                if (betAmount > 0) {
                    currentSeat = seat;
                    winLoseDialog.classList.remove('hidden');
                } else {
                    currentSeat = seat;
                    betDialog.classList.remove('hidden');
                }
            } else {
                currentSeat = seat;
                assignDialog.classList.remove('hidden');
            }
        });
    });

    // Event listener for assigning a player to a seat
    assignButton.addEventListener('click', () => {
        const viewerName = viewerNameInput.value.trim();
        if (viewerName && currentSeat) {
            currentSeat.classList.add('assigned');
            currentSeat.innerHTML = `${viewerName}<div class="balance" data-balance="1000">1000</div><div class="bet">0</div>`;
            viewerNameInput.value = '';
            assignDialog.classList.add('hidden');
        }
    });

    // Event listener for placing a bet
    placeBetButton.addEventListener('click', () => {
        const betAmount = parseInt(betAmountInput.value.trim(), 10);
        if (betAmount > 0 && currentSeat) {
            const balanceElement = currentSeat.querySelector('.balance');
            let currentBalance = parseInt(balanceElement.getAttribute('data-balance'), 10);
            if (betAmount <= currentBalance) {
                currentBalance -= betAmount;
                balanceElement.setAttribute('data-balance', currentBalance);
                balanceElement.textContent = currentBalance;

                const betElement = currentSeat.querySelector('.bet');
                betElement.textContent = betAmount;

                betAmountInput.value = '';
                betDialog.classList.add('hidden');
            } else {
                alert('Insufficient balance to place this bet.');
            }
        }
    });

        // Event listener for winning a round
        winButton.addEventListener('click', () => {
            const betElement = currentSeat.querySelector('.bet');
            const betAmount = parseInt(betElement.textContent, 10);

            if (betAmount > 0) {
                const balanceElement = currentSeat.querySelector('.balance');
                let currentBalance = parseInt(balanceElement.getAttribute('data-balance'), 10);
                currentBalance += betAmount * 2; // Payout 2:1
                balanceElement.setAttribute('data-balance', currentBalance);
                balanceElement.textContent = currentBalance;

                betElement.textContent = '0';
            }

            betDoubled = false;
            winLoseDialog.classList.add('hidden');
        });

    // Event listener for tying a round
    tieButton.addEventListener('click', () => {
        const betElement = currentSeat.querySelector('.bet');
        const betAmount = parseInt(betElement.textContent, 10);

        if (betAmount > 0) {
            const balanceElement = currentSeat.querySelector('.balance');
            let currentBalance = parseInt(balanceElement.getAttribute('data-balance'), 10);
            currentBalance += betAmount; // Return bet amount
            balanceElement.setAttribute('data-balance', currentBalance);
            balanceElement.textContent = currentBalance;

            betElement.textContent = '0';
        }

        betDoubled = false;
        winLoseDialog.classList.add('hidden');
    });

        // Event listener for blackjack
        blackjackButton.addEventListener('click', () => {
            const betElement = currentSeat.querySelector('.bet');
            const betAmount = parseInt(betElement.textContent, 10);

            if (betAmount > 0) {
                const balanceElement = currentSeat.querySelector('.balance');
                let currentBalance = parseInt(balanceElement.getAttribute('data-balance'), 10);
                currentBalance += Math.floor(betAmount * 2.5); // Payout 3:2
                balanceElement.setAttribute('data-balance', currentBalance);
                balanceElement.textContent = currentBalance;

                betElement.textContent = '0';
            }

            betDoubled = false;
            winLoseDialog.classList.add('hidden');
        });


    // Event listener for losing a round
    loseButton.addEventListener('click', () => {
        const betElement = currentSeat.querySelector('.bet');
        betElement.textContent = '0';

        betDoubled = false;
        winLoseDialog.classList.add('hidden');
    });

    // Event listener for doubling the bet
    doubleButton.addEventListener('click', () => {
        if (!betDoubled) {
            const betElement = currentSeat.querySelector('.bet');
            let betAmount = parseInt(betElement.textContent, 10);

            if (
                betAmount > 0) {
                    const balanceElement = currentSeat.querySelector('.balance');
                    let currentBalance = parseInt(balanceElement.getAttribute('data-balance'), 10);
                    if (betAmount <= currentBalance) {
                        currentBalance -= betAmount;
                        balanceElement.setAttribute('data-balance', currentBalance);
                        balanceElement.textContent = currentBalance;
    
                        betAmount *= 2;
                        betElement.textContent = betAmount;
    
                        betDoubled = true;
                    } else {
                        alert('Insufficient balance to double the bet.');
                    }
                }
            }
        });
    
        // Event listener for removing a player from a seat
        removePlayerButton.addEventListener('click', () => {
            if (currentSeat) {
                currentSeat.classList.remove('assigned');
                currentSeat.innerHTML = 'Seat'; // Reset seat content
            }
            betDialog.classList.add('hidden');
        });
    
        // Event listener for changing a player's balance
        changeBalanceButton.addEventListener('click', () => {
            if (currentSeat) {
                newBalanceInput.value = currentSeat.querySelector('.balance').textContent;
                newBalanceInput.focus();
            }
        });
    
        // Event listener for confirming a new balance for a player
        changeBalanceDoneButton.addEventListener('click', () => {
            if (currentSeat && newBalanceInput.value !== '') {
                const newBalance = parseInt(newBalanceInput.value, 10);
                const balanceElement = currentSeat.querySelector('.balance');
                balanceElement.textContent = newBalance;
                balanceElement.setAttribute('data-balance', newBalance);
                newBalanceInput.value = '';
                betDialog.classList.add('hidden');
            }
        });
    
        // Event listener for closing the bet dialog
        closeBetDialogButton.addEventListener('click', () => {
            betDialog.classList.add('hidden');
        });
    
        // Event listener for closing the win/lose dialog
        closeButton.addEventListener('click', () => {
            winLoseDialog.classList.add('hidden');
        });
    
        // Event listener for the dealer seat
        dealerSeat.addEventListener('click', () => {
            dealerDialog.classList.remove('hidden');
        });

        // Event listener for confirming and starting the dealer countdown
        confirmCountdownButton.addEventListener('click', () => {
            const seconds = parseInt(dealerCountdownInput.value, 10);
            if (seconds > 0) {
                dealerDialog.classList.add('hidden');
                dealerSeat.textContent = seconds;
                startCountdown(seconds);
            } else {
                alert('Please enter a valid number of seconds.');
            }
        });

        function startCountdown(seconds) {
            let timer = seconds;
            clearInterval(countdownTimer); // Clear previous countdown timer
            countdownTimer = setInterval(() => {
                dealerSeat.textContent = timer;
                timer--;
                if (timer < 0) {
                    clearInterval(countdownTimer);
                    dealerSeat.textContent = 'Dealer';
                }
            }, 1000);
        }})
