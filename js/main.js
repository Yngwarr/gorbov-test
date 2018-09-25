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
			btn.classList.add(`roll-${j+i+1}`);
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
	current = 1;
}

function btn_click(e) {
	const num = parseInt(e.target.innerText);
	if (num !== current) return;
	e.target.disabled = true;
	++current;
}

function roll(wipe) {
	let f = (n, fwd, switch_cb, wave_cb) => {
		let line = document.querySelectorAll(`#board button.roll-${n}`);
		for (let i = 0; i < line.length; ++i) {
			line[i].disabled = !!fwd;
			if (switch_cb) switch_cb(line[i], fwd);
		}
		// set the second wave up
		if (n === SIDE*2 && fwd) {
			if(wave_cb) wave_cb();
			setTimeout(f, 50, 1, false, switch_cb, wave_cb);
			return;
		}
		// roll the next layer
		if (n < SIDE*2) {
			setTimeout(f, 50, n+1, fwd, switch_cb, wave_cb);
		}
	}
	//if (wipe) f(1, true, (b, fwd) => { b.classList.add('blank'); });
	//else f(1, true, (b, fwd) => { if (!fwd) b.classList.remove('blank'); });
	f(1, true, (b, fwd) => {
		if (fwd) b.classList.add('blank');
		else b.classList.remove('blank');
	}, fill_btns);
}
