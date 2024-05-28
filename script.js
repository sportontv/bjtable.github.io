document.addEventListener('DOMContentLoaded', () => {
    const seats = document.querySelectorAll('.seat');
    const assignDialog = document.getElementById('assign-dialog');
    const betDialog = document.getElementById('bet-dialog');
    const winLoseDialog = document.getElementById('win-lose-dialog');
    const winLoseDialogSecond = document.getElementById('win-lose-dialog-second');
    const dealerDialog = document.getElementById('dealer-dialog');
    const viewerNameInput = document.getElementById('viewer-name');
    const betAmountInput = document.getElementById('bet-amount');
    const assignButton = document.getElementById('assign-button');
    const placeBetButton = document.getElementById('place-bet-button');
    const winButton = document.getElementById('win-button');
    const loseButton = document.getElementById('lose-button');
    const doubleButton = document.getElementById('double-button');
    const splitButton = document.getElementById('split-button');
    const pushButton = document.getElementById('push-button');
    const blackjackButton = document.getElementById('blackjack-button');
    const closeButton = document.getElementById('close-button');
    const winButtonSecond = document.getElementById('win-button-second');
    const loseButtonSecond = document.getElementById('lose-button-second');
    const doubleButtonSecond = document.getElementById('double-button-second');
    const pushButtonSecond = document.getElementById('push-button-second');
    const blackjackButtonSecond = document.getElementById('blackjack-button-second');
    const closeButtonSecond = document.getElementById('close-button-second');
    const removePlayerButton = document.getElementById('remove-player-button');
    const changeBalanceButton = document.getElementById('change-balance-button');
    const newBalanceInput = document.getElementById('new-balance');
    const changeBalanceDoneButton = document.getElementById('change-balance-done-button');
    const closeBetDialogButton = document.getElementById('close-bet-dialog-button');
    const countdownSecondsInput = document.getElementById('countdown-seconds');
    const confirmCountdownButton = document.getElementById('confirm-countdown-button');
    let currentSeat = null;
    let betDoubled = false;
    let countdownInterval = null;

    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            if (seat.classList.contains('assigned')) {
                const betElement = seat.querySelector('.bet');
                const splitBetElement = seat.querySelector('.bet.split');
                const betAmount = parseInt(betElement.textContent, 10);

                if (betAmount > 0) {
                    currentSeat = seat;

                    if (splitBetElement) {
                        winLoseDialog.classList.remove('hidden');
                        winLoseDialogSecond.classList.remove('hidden');
                    } else {
                        winLoseDialog.classList.remove('hidden');
                    }
                } else {
                    currentSeat = seat;
                    betDialog.classList.remove('hidden');
                }
            } else if (seat.classList.contains('dealer')) {
                dealerDialog.classList.remove('hidden');
            } else {
                currentSeat = seat;
                assignDialog.classList.remove('hidden');
            }
        });
    });

    assignButton.addEventListener('click', () => {
        const viewerName = viewerNameInput.value.trim();
        if (viewerName && currentSeat) {
            currentSeat.classList.add('assigned');
            currentSeat.innerHTML = `${viewerName}<div class="balance" data-balance="1000">1000</div><div class="bet">0</div>`;
            viewerNameInput.value = '';
            assignDialog.classList.add('hidden');
        }
    });

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

                // Remove split bet if it exists
                const splitBetElement = currentSeat.querySelector('.bet.split');
                if (splitBetElement) {
                    currentSeat.removeChild(splitBetElement);
                }

                betAmountInput.value = '';
                betDialog.classList.add('hidden');
            } else {
                alert('Insufficient balance to place this bet.');
            }
        }
    });

    const handleResult = (result, betElement) => {
        const betAmount = parseInt(betElement.textContent, 10);

        if (betAmount > 0) {
            const balanceElement = currentSeat.querySelector('.balance');
            let currentBalance = parseInt(balanceElement.getAttribute('data-balance'), 10);

            switch(result) {
                case 'win':
                    currentBalance += betAmount * 2; // 1:1 payout
                    break;
                case 'lose':
                    break;
                case 'double':
                    if (!betDoubled) {
                        if (betAmount <= currentBalance) {
                            currentBalance -= betAmount;
                            betAmount *= 2;
                            betElement.textContent = betAmount;
                            betDoubled = true;
                        } else {
                            alert('Insufficient balance to double the bet.');
                        }
                    }
                    break;
                case 'push':
                    currentBalance += betAmount;
                    break;
                case 'blackjack':
                    currentBalance += betAmount * 2.5; // 3:2 payout
                    break;
            }

            balanceElement.setAttribute('data-balance', currentBalance);
            balanceElement.textContent = currentBalance;
            betElement.textContent = '0';
        }

        betDoubled = false;
    }

    winButton.addEventListener('click', () => {
        handleResult('win', currentSeat.querySelector('.bet'));
        winLoseDialog.classList.add('hidden');
    });

    loseButton.addEventListener('click', () => {
        handleResult('lose', currentSeat.querySelector('.bet'));
        winLoseDialog.classList.add('hidden');
    });

    doubleButton.addEventListener('click', () => {
        handleResult('double', currentSeat.querySelector('.bet'));
    });

    pushButton.addEventListener('click', () => {
        handleResult('push', currentSeat.querySelector('.bet'));
        winLoseDialog.classList.add('hidden');
    });

    blackjackButton.addEventListener('click', () => {
        handleResult('blackjack', currentSeat.querySelector('.bet'));
        winLoseDialog.classList.add('hidden');
    });

    winButtonSecond.addEventListener('click', () => {
        handleResult('win', currentSeat.querySelector('.bet.split'));
        winLoseDialogSecond.classList.add('hidden');
    });

    loseButtonSecond.addEventListener('click', () => {
        handleResult('lose', currentSeat.querySelector('.bet.split'));
        winLoseDialogSecond.classList.add('hidden');
    });

    doubleButtonSecond.addEventListener('click', () => {
        handleResult('double', currentSeat.querySelector('.bet.split'));
    });

    pushButtonSecond.addEventListener('click', () => {
        handleResult('push', currentSeat.querySelector('.bet.split'));
        winLoseDialogSecond.classList.add('hidden');
    });

    blackjackButtonSecond.addEventListener('click', () => {
        handleResult('blackjack', currentSeat.querySelector('.bet.split'));
        winLoseDialogSecond.classList.add('hidden');
    });

    closeButton.addEventListener('click', () => {
        winLoseDialog.classList.add('hidden');
    });

    closeButtonSecond.addEventListener('click', () => {
        winLoseDialogSecond.classList.add('hidden');
    });

    splitButton.addEventListener('click', () => {
        const betElement = currentSeat.querySelector('.bet');
        const betAmount = parseInt(betElement.textContent, 10);

        if (betAmount > 0) {
            const balanceElement = currentSeat.querySelector('.balance');
            let currentBalance = parseInt(balanceElement.getAttribute('data-balance'), 10);
            if (betAmount <= currentBalance) {
                currentBalance -= betAmount;
                balanceElement.setAttribute('data-balance', currentBalance);
                balanceElement.textContent = currentBalance;

                const splitBetElement = document.createElement('div');
                splitBetElement.classList.add('bet', 'split');
                splitBetElement.textContent = betAmount;
                currentSeat.appendChild(splitBetElement);
            } else {
                alert('Insufficient balance to split the bet.');
            }
        }
    });

    removePlayerButton.addEventListener('click', () => {
        if (currentSeat) {
            currentSeat.classList.remove('assigned');
            currentSeat.classList.remove('dealer');
            currentSeat.innerHTML = currentSeat.getAttribute('data-original-text');
            currentSeat = null;
        }
    });

    changeBalanceButton.addEventListener('click', () => {
        if (currentSeat) {
            changeBalanceDialog.classList.remove('hidden');
        }
    });

    changeBalanceDoneButton.addEventListener('click', () => {
        if (currentSeat) {
            const newBalance = parseInt(newBalanceInput.value.trim(), 10);
            if (!isNaN(newBalance) && newBalance >= 0) {
                const balanceElement = currentSeat.querySelector('.balance');
                balanceElement.setAttribute('data-balance', newBalance);
                balanceElement.textContent = newBalance;
                newBalanceInput.value = '';
                changeBalanceDialog.classList.add('hidden');
            } else {
                alert('Please enter a valid balance amount.');
            }
        }
    });

    closeBetDialogButton.addEventListener('click', () => {
        betDialog.classList.add('hidden');
    });

    confirmCountdownButton.addEventListener('click', () => {
        const countdownSeconds = parseInt(countdownSecondsInput.value.trim(), 10);
        if (!isNaN(countdownSeconds) && countdownSeconds > 0) {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }

            let remainingTime = countdownSeconds;
            const countdownDisplay = document.getElementById('countdown-display');
            countdownDisplay.textContent = remainingTime;

            countdownInterval = setInterval(() => {
                remainingTime -= 1;
                countdownDisplay.textContent = remainingTime;

                if (remainingTime <= 0) {
                    clearInterval(countdownInterval);
                    countdownDisplay.textContent = 'Time\'s up!';
                }
            }, 1000);
        } else {
            alert('Please enter a valid number of seconds.');
        }
    });
});
