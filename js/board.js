class Board {
	constructor() {
		this.current = 1;
		this.init();
	}
	// creates buttons in the board
	init() {
		let brd = document.getElementById('board');
		// populate the brd with buttons
		for (let i = 0; i < SIDE; ++i) {
			let row = document.createElement('div');
			row.classList.add('row');
			for (let j = 0; j < SIDE; ++j) {
				let btn = document.createElement('button');
				btn.appendChild(document.createTextNode(' '));
				btn.classList.add(`roll-${j+i+1}`, 'blank');
				btn.addEventListener('click', (e) => {
					this.btn_click.call(this, e);
				});
				row.appendChild(btn);
			}
			brd.appendChild(row);
		}
	}
	// every button has its click function
	btn_click(e) {
		const num = parseInt(e.target.innerText);
		if (num !== board.current) return;
		e.target.disabled = true;
		++this.current;
	}
	// fills buttons with random numbers
	populate() {
		let btns = document.querySelectorAll('#board button');
		let r = _.shuffle(_.range(1,SIDE**2+1));
		for (let i = 0; i < SIDE**2; ++i) {
			btns[i].innerText = r.pop();
		}
		this.current = 1;
	}
	// wipes a board and repopulates it
	reset() {
		this.roll((b, fwd) => {
			if (fwd) b.classList.add('blank');
			else b.classList.remove('blank');
		}, () => { this.populate.call(this) });
		this.current = 1;
	}
	wipe_roll() {
		this.roll((b, fwd) => { b.classList.add('blank'); });
	}
	unwipe_roll() {
		this.roll((b, fwd) => { if (!fwd) b.classList.remove('blank'); })
	}
	roll(switch_cb, wave_cb) {
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
		f(1, true, switch_cb, wave_cb);
	}
}
