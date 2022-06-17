const fruits = [{
        name: 'apple',
        img: 'fruits/apple.png',
    },
    {
        name: 'banana',
        img: 'fruits/banana.png',
    },
    {
        name: 'cherries',
        img: 'fruits/cherries.png',
    },
    {
        name: 'orange',
        img: 'fruits/orange.png',
    },
    {
        name: 'mango',
        img: 'fruits/mango.png',
    },
    {
        name: 'watermelon',
        img: 'fruits/watermelon.png',
    },
]

const meats = [{
        name: 'chicken',
        img: 'meats/chicken.png',
    },
    {
        name: 'cola',
        img: 'meats/cola.png',
    },
    {
        name: 'egg',
        img: 'meats/egg.png',
    },
    {
        name: 'meat',
        img: 'meats/meat.png',
    },
    {
        name: 'mot',
        img: 'meats/mot.png',
    },
    {
        name: 'salad',
        img: 'meats/salad.png',
    },
]

const startBtn = document.getElementById("startBtn");
const cards = document.querySelectorAll(".cards .card");
const player1 = document.querySelector("._player1");
const player2 = document.querySelector("._player2");

let canPlayer1Click = true;
let canClick = true;

let player1Score = 0
let player2Score = 0
let shuffleCard;
let winCards = [];
let cardsChosen = [];

let timePlayer1 = 182;
let timePlayer2 = 182;

function startGame() {
        


    document.querySelector(".menu").classList.add("d-none");
    document.querySelector(".game-info").classList.replace("d-none", "d-flex");
    document.querySelector("#gameBoard").classList.remove("d-none");

    localStorage.clear();

    setInterval(updatePlayerInfo, 50);
    BoradGame()
}


function BoradGame() {

    let array1 = Get4Card(fruits.sort(() => Math.random() - 0.5))
    let array2 = Get4Card(meats.sort(() => Math.random() - 0.5))

    shuffleCard = array1.concat(array2);
    shuffleCard = shuffleCard.concat(shuffleCard)
    shuffleCard = shuffleCard.sort(() => Math.random() - 0.5);

        
        // Event
        load()
        
    cards.forEach((card, i) => {
        card.setAttribute("data-id", (i + 1))
        card.setAttribute("data-img", shuffleCard[i].name)
        card.addEventListener("click", flipCard)
    });
}


function flipCard() {

    if (!canClick) return;
    let audioFlip = new Audio();

    // add sound for game
    audioFlip.src = "assets/sound/flip-card.mp3";
    audioFlip.play();

    let img = Array.from(shuffleCard).filter(card => {
        if (card.name == this.dataset.img) return card.img;
    });

    this.querySelector("img").src = "assets/Images/" + img[0].img;
    this.classList.add("flip");
    cardsChosen.push(this);

    if (cardsChosen.length == 2) {
        setTimeout(checkMatches, 1000)
        canClick = false;
    }
}



function checkMatches() {

    let card1 = cardsChosen[0];
    let card2 = cardsChosen[1];

    // if card match
    if (card1.dataset.id != card2.dataset.id &&
        card1.dataset.img == card2.dataset.img &&
        !card1.classList.contains("match") &&
        !card1.classList.contains("match")) {

        if (canPlayer1Click) player1Score += 1;
        if (!canPlayer1Click) player2Score += 1;

        card1.classList.add("match")
        card2.classList.add("match")

        if(canPlayer1Click) {
            timePlayer1 = 182;
            canPlayer1Click = true
        } else if(!canPlayer1Click)
        {
            timePlayer2 = 182;
            canPlayer1Click = false
        } 
            
        
        cardsChosen = [];
        winCards.push(card1);
    }

    // if card not match
    if (card1.dataset.id != card2.dataset.id &&
        card1.dataset.img != card2.dataset.img &&
        !card1.classList.contains("match") &&
        !card1.classList.contains("match")) {

        card1.classList.remove("flip");
        card2.classList.remove("flip");
        card1.querySelector("img").src = card2.querySelector("img").src = "assets/Images/blank.png";
        cardsChosen = [];
        canPlayer1Click = canPlayer1Click == true ? false : true;
    }

    // if clicked the same card
    if (card1.dataset.id == card2.dataset.id &&
        card1.dataset.img == card2.dataset.img &&
        !card1.classList.contains("match") &&
        !card1.classList.contains("match")) {

        card1.classList.remove("flip");
        card2.classList.remove("flip");
        card1.querySelector("img").src = card2.querySelector("img").src = "assets/Images/blank.png";
        cardsChosen = [];
        canPlayer1Click = canPlayer1Click == true ? false : true;
    }

    canClick = true;

    // change score player 

    document.querySelector("._player1_score").innerText = player1Score
    document.querySelector("._player2_score").innerText = player2Score

}

function updatePlayerInfo() {

    if (winCards.length == shuffleCard.length / 2) return gameEnd();


    // Value input
    const player1Name = document.getElementById("player1Name");
    const player2Name = document.getElementById("player2Name");

    if (player1Name.value != "" || player2Name.value != "") {
        document.querySelector("._player1_name").textContent = player1Name.value;
        document.querySelector("._player2_name").textContent = player2Name.value;
    }


    function timer() {

        if(timePlayer1 == 0) canPlayer1Click = false; 
        if(timePlayer2 == 0) canPlayer1Click = true; 

         if(canPlayer1Click) timePlayer1--;
         if(!canPlayer1Click) timePlayer2--;

        if (canPlayer1Click) {
            player1.querySelector(".progress-bar").style.width = timePlayer1 + "px";
            player2.querySelector(".progress-bar").style.width = "182px";
            timePlayer2 = 182;
        } else if (!canPlayer1Click) {
            player2.querySelector(".progress-bar").style.width = timePlayer2 + "px";
            player1.querySelector(".progress-bar").style.width = "182px";
            timePlayer1 = 182;
        }

    }

    timer();



    // Set data to localeStorage

    let data = {
        player1: {
            name: player1Name.value == "" ? "Player 1" : player1Name.value,
            score: player1Score,
        },
        player2: {
            name: player2Name.value == "" ? "Player2" : player2Name.value,
            score: player2Score,
        }
    };

    localStorage.setItem("data", JSON.stringify(data));

}


//test




// for get 4 card in fruits and 4 in meats
function Get4Card(array) {
    let temp = [];
    for (let i = 0; i < 4; i++) {
        temp.push(array[i]);
    }
    return temp;
}


function gameEnd() {
    window.location.href = "result.html"
}

// load image 

function load () {
    for (let card of shuffleCard) {
      let image = new Image();
       image.src = "https://mustafa891.github.io/Memory-Game-Js-/assets/Images/" + card.img;
    }
     let audio = new Audio (); 
      audio.src = https://mustafa891.github.io/Memory-Game-Js-/assets/sound/flip-card.mp3";
}

startBtn.addEventListener("click", startGame);
