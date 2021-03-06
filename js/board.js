class Board {
	constructor() {
		this.current = 1;
		this.stage = 0;
		//this.STAGE_LIM = 5;
		this.STAGE_LIM = 5;
		this.init();
	}
	// creates buttons in the board
	init() {
		let brd = document.getElementById('board');
		// populate the board with buttons
		for (let i = 0; i < SIDE; ++i) {
			let row = document.createElement('div');
			row.classList.add('row');
			for (let j = 0; j < SIDE; ++j) {
				let btn = document.createElement('button');
				btn.appendChild(document.createTextNode(' '));
				btn.classList.add(`wave-${j+i+1}`, 'blank', 'idle');
				btn.dataset.x = i;
				btn.dataset.y = j;
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
		if (e.target.classList.contains('idle')) return;
		const num = parseInt(e.target.innerText);
		if (num !== board.current) {
			// misclick
			fail(e.target);	
			timer.snapshot('f');
			return;
		}
		timer.snapshot();
		if (e.target.innerText === '25') {
			timer.stop();
			if (++this.stage < this.STAGE_LIM) {
				setTimeout(() => {
					this.reset(() => {
						timer.reset();
						timer.start();
					});
				}, 500);
			} else {
				setTimeout(() => this.wipe_wave(), 500);
				document.getElementById('ctl').classList.remove('disabled');
				document.getElementById('time').textContent = 'Тест Шульте';
				timer.reset();
				timer.dump = null;

				draw_stats();

				session.save_dump(timer.dumps);
				show_modal('win-stats');
				if (this.bang) this.bang = undefined;
			}
		}
		e.target.disabled = true;
		setTimeout((t) => {
			t.disabled = false;
		}, 200, e.target)
		++this.current;
		if (this.bang) this.hint();
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
	reset(done_cb) {
		document.querySelectorAll('#board button.idle').forEach((b) => {
			b.classList.remove('idle');
		});
		this.wave((b, fwd) => {
			if (fwd) b.classList.add('blank');
			else b.classList.remove('blank');
		}, () => { this.populate.call(this) }, done_cb);
		this.current = 1;
	}
	wipe_wave() {
		this.wave((b, fwd) => { b.classList.add('blank'); });
	}
	unwipe_wave() {
		this.wave((b, fwd) => { if (!fwd) b.classList.remove('blank'); })
	}
	// switch_cb is called every time a button is disabled/enabled and takes
	//           has a button and a wave's direction
	// wave_cb is called once the wave reaches the final button, right before
	//           the change of a wave's direction
	// end_cb is called once a wave's complete
	wave(switch_cb, wave_cb, end_cb, _cls) {
		let f = (n, fwd, cls, scb, wcb, ecb) => {
			let line = document.querySelectorAll(`#board button.wave-${n}`);
			for (let i = 0; i < line.length; ++i) {
				if (cls) {
					if (fwd) line[i].classList.add(cls);
					else line[i].classList.remove(cls);
				} else {
					line[i].disabled = !!fwd;
				}
				if (scb) scb(line[i], fwd);
			}
			// set the second wave up
			if (n === SIDE*2 && fwd) {
				if (wcb) wcb();
				setTimeout(f, 50, 1, false, cls, scb, wcb, ecb);
				return;
			}
			// wave the next layer
			if (n < SIDE*2) {
				setTimeout(f, 50, n+1, fwd, cls, scb, wcb, ecb);
				return;
			}
			// the last call
			if (ecb) ecb();
		}
		f(1, true, _cls, switch_cb, wave_cb, end_cb);
	}
	circle(btn, cls, done_cb) {
		let [x, y] = [btn.dataset.x, btn.dataset.y];
		let f = (bs, _bs, cls, brd, dcb) => {
			let nbs = [];
			for (let i = 0; i < bs.length; ++i) {
				bs[i].classList.add(cls);
				let hood = brd.nhood(bs[i]);
				nbs = nbs.concat(_.difference(hood, _bs));
			}
			for (let i = 0; i < _bs.length; ++i) {
				_bs[i].classList.remove(cls);
			}
			nbs = _.uniq(nbs);
			if (bs.length === 0) {
				if (dcb) dcb();
				return;
			}
			setTimeout(f, 100, nbs, bs, cls, brd, dcb);
		};
		f([btn], [], cls, this, done_cb);
	}
	nhood(btn) {
		let [x, y] = [parseInt(btn.dataset.x), parseInt(btn.dataset.y)];
		let h = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
		h = h.filter(([_x, _y]) => {
			return (_x >= 0 && _x < SIDE) && (_y >= 0 && _y < SIDE);
		});
		let q = h.map(([_x, _y]) => {
			return `[data-x='${_x}'][data-y='${_y}']`;
		}).join(',');
		return document.querySelectorAll(q);
	}
	hint() {
		document.querySelectorAll('#board button').forEach((b) => {
			if (b.textContent === this.current.toString() && this.bang) {
				b.classList.add('hint');
			} else {
				b.classList.remove('hint');
			}
		});
	}
}
