document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    document.getElementById("mines").innerHTML = bombAmount - flags;
    const result = document.querySelector('#result')

    // timer
    let secondsLabel = document.getElementById("time");
    let totalSeconds = 0;
    setInterval(setTime, 1000);

    function setTime() {
        ++totalSeconds;
        if (!isGameOver) {
            secondsLabel.innerHTML = pad(totalSeconds);
        }
    }

    function pad(val) {
        let valString = val + "";
        if (valString.length < 2) {
            return "00" + valString;
        }
        else if (valString.length < 3)
            return "0" + valString;
        else if (valString.length === 3) {
            return valString;
        }
        else {
            return 999;
        }
    }


    //create board
    function createBoard() {
        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emtyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emtyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
        for (let i = 0; i < width * width; ++i) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.setAttribute('class', 'cell');
            square.classList.add(shuffledArray[i])
            grid.appendChild(square);
            squares.push(square);

            // normal click
            square.addEventListener('click', function (e) {
                click(square);
            })

            //control and left click
            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        //add numbers
        for (let i = 0; i < squares.length; ++i) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
                    ++total;
                }
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) {
                    ++total;
                }
                if (i > 10 && squares[i - width].classList.contains('bomb')) {
                    ++total;
                }
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) {
                    ++total;
                }
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) {
                    ++total;
                }
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) {
                    ++total;
                }
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
                    ++total;
                }
                if (i < 89 && squares[i + width].classList.contains('bomb')) {
                    ++total;
                }
                squares[i].setAttribute('data', total);
            }
        }
    }
    createBoard();

    // add flag with right click
    function addFlag(square) {
        if (isGameOver) {
            return;
        }
        if (!square.classList.contains('checked') && flags < bombAmount) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                ++flags;
                document.getElementById("mines").innerHTML = bombAmount - flags;
                checkForWin();
            }
            else {
                square.classList.remove('flag');
                square.innerHTML = '';
                document.getElementById("mines").innerHTML = bombAmount - flags;
                --flags;
            }
        }
    }

    //click on square actions
    function click(square) {
        let currentID = square.id;
        if (isGameOver) {
            return;
        }
        if (square.classList.contains('checked') || square.classList.contains('flag')) {
            return;
        }
        if (square.classList.contains('bomb')) {
            gameOver(square);
        }
        else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return;
            }
            checkSquare(square, currentID);
        }
        square.classList.add('checked');
    }

    //ckeck neighbor squares if square is clicked
    function checkSquare(square, currentID) {
        const isLeftEdge = (currentID % width === 0);
        const isRightEdge = (currentID % width === width - 1);

        setTimeout(() => {
            if (currentID > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentID) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentID > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentID) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentID > 10) {
                const newId = squares[parseInt(currentID - width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentID > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentID) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentID < 99 && !isRightEdge) {
                const newId = squares[parseInt(currentID) + 1].id;
                const newSquare = document.getElementById(newId);
                console.log(newSquare);
                click(newSquare);
            }
            if (currentID < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentID) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentID < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentID) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentID < 89) {
                const newId = squares[parseInt(currentID) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
    }

    //game over
    function gameOver(square) {
        console.log("Game over");
        document.getElementById("img").src = "./Images/sad_face.jpg";
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true;

        //show all the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
            }
        })
    }

    //check for win
    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; ++i) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                ++matches;
            }
            if (matches === bombAmount) {
                document.getElementById("img").src = "./Images/win_face.jpg";
                result.innerHTML = 'YOU WIN!'
                isGameOver = true;
            }
        }
    }
})