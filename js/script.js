const wordText = document.querySelector('.container__content--word');
const hintText = document.querySelector('.container__content--details--hint span');
const timeText = document.querySelector('.container__content--details--time span b');
const inputField = document.querySelector('.container__content input');
const refreshBtn = document.querySelector('.container__content--buttons--refresh');
const checkBtn = document.querySelector('.container__content--buttons--check');

let correctWord, timer, maxTime;

const loadData = async () => {
    try {
        const data = await fetch('/js/words.json');
        const words = await data.json();
        return words;
    } catch (error) {
        console.log(error);
    }
}

const initTimer = () => {
    clearInterval(timer);
    maxTime = 30;
    timer = setInterval(() => {
        maxTime--;
        timeText.innerText = maxTime;

        if (maxTime == 0) {
            clearInterval(timer);
            Swal.fire({
                icon: 'error',
                title: `Time's up!`,
                text: `Let's try again with another word`,
              }).then(result => {
                if (result.isConfirmed) {
                    initGame();  
                }
              })
        }
    }, 1000);
}

const initGame = async () => {

    initTimer();

    const words = await loadData();
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const wordArray = randomWord.word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomWord.hint;
    correctWord = randomWord.word.toLowerCase();
    inputField.value = "";
    inputField.setAttribute('maxlength', correctWord.length);
}
const checkWord = () => {
    let userWord = inputField.value.toLowerCase();
    userWord === correctWord 
    ?  Swal.fire({
        icon: 'success',
            title: 'Correct!',
            text: `${correctWord.toUpperCase()} is the correct word`,
        }).then(result => {
            if (result.isConfirmed) {
                initGame();  
            }
        })
        : Swal.fire({
            icon: 'error',
            title: 'Uuups!',
            text: `${userWord} wasn't the correct word`,
        }).then(result => {
            if (result.isConfirmed) {
                initGame();  
            }
        })
        if (!userWord) {
            Swal.fire({
                icon: 'error',
                title: 'Uuups!',
                text: 'Please enter a word if you wanna play',
            }).then(result => {
                if (result.isConfirmed) {
                    initGame();  
                }
            })
        }
    }
    
    initGame();
    refreshBtn.addEventListener('click', initGame);
    checkBtn.addEventListener('click', checkWord);      