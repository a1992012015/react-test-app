//fibonacci.js
function Fibonacci2(n, ac1 = 1, ac2 = 1) {
	if(n <= 1) {
		return ac2
	}

	return Fibonacci2(n - 1, ac2, ac1 + ac2);
}

let fibonacci = function(n) {
	return n < 2 ? n : arguments.callee(n - 1) + arguments.callee(n - 2);
};
onmessage = function(event) {
	let n = parseInt(event.data.num, 10);
	if(event.data.flag) {
		postMessage(fibonacci(n));
	} else {
		postMessage(Fibonacci2(n));

	}
};