const SIDE = 5

let board;
let timer;

function init() {
	board = new Board();
	timer = new Timer();
	//start();
}

function start() {
	document.getElementById('ctl').classList.add('disabled');
	board.reset(() => { timer.start(); });
}

function fail(btn) {
	timer.el.classList.add('stopped');
	btn.classList.add('red');
	setTimeout((b) => {
		btn.classList.remove('red');
		setTimeout(() => {
			timer.el.classList.remove('stopped');
		}, 200);
	}, 200, btn);
}
