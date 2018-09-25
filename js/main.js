const SIDE = 5
let current = 1;

function init() {
	fill_board();
	fill_btns()
}

// creates buttons in the board
function fill_board() {
	let board = document.getElementById('board');
	// populate the board with buttons
	for (let i = 0; i < SIDE; ++i) {
		let row = document.createElement('div');
		row.classList.add('row');
		for (let j = 0; j < SIDE; ++j) {
			let btn = document.createElement('button');
			btn.appendChild(document.createTextNode(' '));
			btn.addEventListener('click', btn_click);
			row.appendChild(btn);
		}
		board.appendChild(row);
	}
}

// fills buttons with random numbers
function fill_btns() {
	let btns = document.querySelectorAll('#board button');
	let r = _.shuffle(_.range(1,SIDE**2+1));
	for (let i = 0; i < SIDE**2; ++i) {
		btns[i].innerText = r.pop();
	}
}

function btn_click(e) {
	const num = parseInt(e.target.innerText);
	if (num !== current) return;
	e.target.disabled = true;
	++current;
}
