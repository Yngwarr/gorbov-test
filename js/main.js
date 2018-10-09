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
	//timer.stop(true);
	timer.el.classList.add('stopped');
	btn.classList.add('red');
	setTimeout((b) => {
		btn.classList.remove('red');
		setTimeout(() => {
			timer.el.classList.remove('stopped');
		}, 200);
	}, 200, btn);


	//board.circle(btn, 'red', () => {
		//setTimeout(() => {
			//timer.reset();
			//start();
		//}, 500)
	//});
}
