export function sendMessage(message) {
	return new Promise((resolve, reject) => {
		browser.runtime.sendMessage(message, response => {
			if (response && response.error) reject(error);
			else resolve(response);
		});
	});
}

export function debounce(f, delay) {
	let timeout = null;
	return function() {
		clearTimeout(timeout);
		timeout = setTimeout(f, delay);
	};
};

export function xhr(method, url, data) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = function() { resolve(this); };
		xhr.onerror = function(e) { reject(e); };
		xhr.send(data);
	});
};