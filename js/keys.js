class KeysEngine {
	constructor() {
		this.seqs = [];
		this.seq = [];
	}
	load() {
		let me = this;
		document.querySelector('body').addEventListener('keydown', (e) => {
			//console.log(`'${e.key}'`);
			me.seq.push(e.key);
			me.cmp()
			//console.log(`seq = ${this.seq}`);
		});
	}
	add(seq, cb) {
		let ss = seq.toString();
		let push = true;
		this.seqs.forEach(([s, _cb], i, arr) => {
			if (s === ss) {
				arr[i][1] = cb;
				push = false;
			}
		});
		if (push) {
			this.seqs.push([ss, cb]);
		}
	}
	cmp() {
		let ss = this.seq.toString();
		let aval = this.seqs.filter(([s, _cb]) => s.indexOf(ss) === 0);
		if (aval.length === 0) {
			this.seq = [];
			return;
		}
		if (aval.length > 1) return;
		if (aval[0][0] !== ss) return;
		aval[0][1]();
		this.seq = [];
	}
}
