document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid')
	let squares = Array.from(document.querySelectorAll('.grid div'))
	const w = 10
	const scoreDisplay = document.querySelector('#score')
	const startBtn = document.querySelector('#start-button')
	let timerId
	let score = 0
	const colors = [
	'#c9293f',
	'#fea2ff',
	'#00ba38',
	'#00fff8',
	'#f7ff6e']


	//Tetrominoes
	const lTetro = [
		[1, w+1, w*2+1, 2],
		[w, w+1, w+2, w*2+2],
		[1, w+1, w*2+1, w*2],
		[w, w*2, w*2+1, w*2+2]
	]

	const zTetro = [
		[0, w, w+1, w*2+1],
		[w+1, w+2, w*2, w*2+1],
		[0, w, w+1, w*2+1],
		[w+1, w+2, w*2, w*2+1]
	]

	const tTetro = [
		[1, w, w+1, w+2],
		[1, w+1, w+2, w*2+1],
		[w, w+1, w+2, w*2+1],
		[1, w, w+1, w*2+1]
	]

	const oTetro = [
		[0, 1, w, w+1],
		[0, 1, w, w+1],
		[0, 1, w, w+1],
		[0, 1, w, w+1]
	]

	const iTetro = [
		[1, w+1, w*2+1,w*3+1],
		[w, w+1, w+2, w+3],
		[1, w+1, w*2+1,w*3+1],
		[w, w+1, w+2, w+3]
	]


	const theTetros = [lTetro, zTetro, tTetro, oTetro, iTetro]

	let currentPosition = 4
	let currentRotation = 0
	let nextRandom = 0

	//random tetromino
	let random = Math.floor(Math.random()*theTetros.length)
	let current = theTetros[random][0]


	//draw tetromino

	function draw() {
		current.forEach(index => {
			squares[currentPosition + index].classList.add('tetromino')
			squares[currentPosition + index].style.backgroundColor= colors[random]
		})
	}

	//undraw the Tetro
	function undraw() {
		current.forEach(index => {
			squares[currentPosition + index].classList.remove('tetromino')
			squares[currentPosition + index].style.backgroundColor= ''
		})
	}

	//move down every second
	//timerId = setInterval(moveDown, 800)

	function moveDown() {
		undraw()
		currentPosition += w
		draw()
		freeze()
	}

	//assign keys
	function control(e) {
		if(e.keyCode ===37) {
			moveLeft() }
		else if(e.keyCode === 39) {
			moveRight() }
		else if(e.keyCode === 38) {
			rotate()}
	}


	document.addEventListener('keyup', control)

	//freeze
	function freeze() {
		if(current.some(index => squares[currentPosition + index + w].classList.contains('taken'))) {
			current.forEach(index => squares[currentPosition + index].classList.add('taken'))
		random = nextRandom
		nextRandom = Math.floor(Math.random() * theTetros.length)
		current = theTetros[random][currentRotation]
		currentPosition = 4
		draw()
		displayShape()
		addScore()
		gameOver()
		}
	}

	//movements
	function moveLeft() { 
		undraw()
		const isAtLeft = current.some(index => (currentPosition + index) % w === 0)

		if(!isAtLeft) currentPosition -=1

		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			currentPosition += 1
		}

		draw()
	}

	function moveRight() { 
		undraw()
		const isAtRight = current.some(index => (currentPosition + index) % w === w-1)

		if(!isAtRight) currentPosition +=1

		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			currentPosition -= 1
		}

		draw()
	}

	function rotate() { 
		undraw()
	 	currentRotation ++

		if(currentRotation === current.length) { 
			currentRotation = 0 }
			current = theTetros[random][currentRotation]
		draw()
	}

	//show next tetro
	const displaySquares = document.querySelectorAll('.mini-grid div')
	const dw = 4
	let displayIndex = 0


	const upNext = [
		[dw+1, dw*2+1, dw*3+1, dw+2],
		[dw+1, dw*2+1, dw*2+2, dw*3+2],
		[dw+1, dw*2, dw*2+1, dw*2+2],
		[dw+1, dw+2, dw*2+1, dw*2+2],
		[1, dw+1, dw*2+1, dw*3+1]
	]

		//[1, dw+1, dw*2+1, 2],
		//[0, dw, dw+1, dw*2+1],
		//[1, dw, dw+1, dw+2],
		//[0, 1, dw, dw+1],
		//[1, dw+1, dw*2+1, dw*3+1]

	function displayShape() {
		displaySquares.forEach(square => {
			square.classList.remove('tetromino')
			square.style.backgroundColor= ''
		})
		upNext[nextRandom].forEach( index => {
			displaySquares[displayIndex + index].classList.add('tetromino')
			displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
		})
	}

	//start button
	startBtn.addEventListener('click', () => {
		if(timerId) {
			clearInterval(timerId)
			timerId = null
		} else {
			draw()
			timerId = setInterval(moveDown, 200)
			nextRandom = Math.floor(Math.random() * theTetros.length)
			displayShape()
  			var audio = new Audio('tetris.mp3');
			audio.play();
		}
	})

	//scores!!!
	function addScore() {
		for (let i = 0; i < 199; i +=w) {
			const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
		
			if(row.every(index => squares[index].classList.contains('taken'))) {
				score += 10
				scoreDisplay.innerHTML = score
				row.forEach(index => {
					squares[index].classList.remove('taken')
					squares[index].classList.remove('tetromino')
					squares[index].style.backgroundColor = ''
				})
				const squaresRemoved = squares.splice(i, w)
				squares = squaresRemoved.concat(squares)
				squares.forEach(cell => grid.appendChild(cell))
			}
		}
	}

	//game over
	function gameOver() {
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			scoreDisplay.innerHTML = score +'  Kaybettin'
			clearInterval(timerId)}
	}
})


