const SIDE = 5

let board;
let timer;

function init() {
	board = new Board();
	timer = new Timer();
	start();
}

function start() {
	board.reset(() => { timer.start(); });
}

function fail(btn) {
	timer.stop();
	//board.wave(null, null, null, 'red');
	board.circle(btn, 'red');
}
