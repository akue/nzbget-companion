export function createButton(clickCallback) {

	const button = document.createElement('img');
	button.src = browser.extension.getURL('assets/icon_grabber.png');
	button.alt = button.title = 'Send to NZBGet';
	button.style.cssText = 'width: 16px; height: 16px; display: inline-block; padding: 0; margin: 0 5px 0 0; cursor: pointer; vertical-align: bottom;';

	button.addEventListener('click', e => {
		if (e.which !== 1) return;
		e.preventDefault();
		e.stopPropagation();
		if (clickCallback) clickCallback();
		return false;
	});

	return button;

}

export function grabDownload(url, filename) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onerror = function(e) { createErrorNotification(e); }
	xhr.onload = function() {
		const message = { type: 'grabDownload', filename, contents: this.responseText };
		browser.runtime.sendMessage(message, response => {
			if (response && response.error) createErrorNotification(error);
			else createSuccessNotification(response);
		})
	}
	xhr.send();
}

export function createSuccessNotification() {
	browser.runtime.sendMessage({ type: 'notification', id: 'grabberSuccess', config: {
		type: 'basic',
		title: 'Grab Success',
		message: 'Successfully grabbed download.',
		iconUrl: 'assets/notification_icon.png'
	}});
};

export function createErrorNotification(e) {
	browser.runtime.sendMessage({ type: 'notification', id: 'grabberError', config: {
		type: 'basic',
		title: 'Grab Failure',
		message: 'Could not grab download.' + (e && e.message ? '\n' + e.message : ''),
		iconUrl: 'assets/notification_icon.png'
	}});
};
