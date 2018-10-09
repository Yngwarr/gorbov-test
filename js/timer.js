class Timer {
	constructor() {
		this.el = document.getElementById('time');
		// timeout ID used to escape the loop
		this.to = null;
		this.reset();
		//this.draw();
	}
	reset() {
		// elapsed time, updates every tick
		this.t = 0;
		this.t_start = 0;
		this.t_end = 0;
		// a storage for time values
		this.dump = [];
	}
	draw() {
		let t = this.t;
		this.el.innerText = `${p_time(t)}`;
	}
	tick() {
		this.t_end = new Date();
		this.t = this.t_end - this.t_start;
		this.draw();
		this.to = setTimeout(() => { this.tick.call(this) }, 50);
	}
	start() {
		this.el.classList.remove('stopped');
		this.t_start = new Date();
		this.t_end = new Date();
		this.tick();
	}
	stop() {
		clearTimeout(this.to);
	}
	snapshot() {
		this.dump.push(this.t);
	}
}

function p_time(t) {
	let ms = t % 1000 << 0;
	let s = (t / 1000) % 60 << 0;
	let m = t / 60000 << 0
	let mt = m ? `${m}:` : '';
	return `${mt}${s/10 << 0}${s%10}.${ms/100 << 0}`;
}
