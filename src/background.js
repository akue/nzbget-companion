import { merge } from './background/DefaultConfig';

import ApiHandler from './background/ApiHandler';
import StatusManager from './background/StatusManager';
import NotificationManager from './background/NotificationManager';

const settings = merge(JSON.parse(localStorage.getItem('settings')));

const statusManager = new StatusManager(settings);
const notificationManager = new NotificationManager(settings, statusManager);

/*---------------
  Status Listener
  ---------------*/

statusManager.on('status', data => {
	broadcast({ status: data, background: true });
	if (statusManager.isPaused()) setIcon('assets/icon_paused.ico');
	else if (statusManager.isWorking()) setIcon('assets/icon_working.ico');
	else setIcon('assets/icon_idle.ico');
});

statusManager.on('groups', data => {
	broadcast({ groups: data, background: true });
	setBadge(data.length);
});

statusManager.on('error', data => {
	broadcast({ error: data, background: true });
});

/*----------------
  Message Listener
  ----------------*/

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

	if (!message) return false;

	switch (message.type) {

		/*-----
		  Popup
		  -----*/

		case 'popupInit':
			sendResponse({
				status: statusManager.status(),
				groups: statusManager.groups(),
				error: statusManager.error()
			});
			return false;

		case 'openNZBGet':
			const url = `${settings.useHTTPS ? 'https' : 'http'}://${settings.host}:${settings.port}`;
			browser.tabs.create({ url, active: true });
			return false;

		case 'limitSpeed':
			statusManager.limitSpeed(message.speed);
			return false;

		case 'togglePause':
			wrapPromise(statusManager.togglePause(), sendResponse);
			return true;

		case 'toggleGroupStatus':
			wrapPromise(statusManager.toggleGroup(message.group), sendResponse);
			return true;

		case 'logs':
			wrapPromise(statusManager.logs(50), sendResponse);
			return true;

		case 'history':
			wrapPromise(statusManager.history(), sendResponse);
			return true;

		/*--------
		  Settings
		  --------*/

		case 'readSettings':
			sendResponse(settings);
			return false;

		case 'persistSettings':
			Object.assign(settings, message.settings || { });
			localStorage.setItem('settings', JSON.stringify(settings));
			notificationManager.updateSettings(settings);
			wrapPromise(statusManager.updateSettings(settings), sendResponse);
			return true;

		case 'testConnection':
			wrapPromise(new ApiHandler(message.settings).version(), sendResponse);
			return true;

		/*-------
		  Grabber
		  -------*/

		case 'notification':
			browser.notifications.create(message.id, message.config);
			setTimeout(() => browser.notifications.clear(message.id), 2000);
			return false;

		case 'grabDownload':
			wrapPromise(statusManager.appendDownload(message.filename, message.contents), sendResponse);
			return true;

		/*------
		  Others
		  ------*/

		default:
			return false;
	}

});

/*------------
  Tab Listener
  ------------*/

browser.webNavigation.onCommitted.addListener(details => {

	if (!settings.grabbingEnabled) return;

	browser.tabs.executeScript(details.tabId, {
		file: '/public/injection/downloadGrabber.js',
		runAt: 'document_idle',
		frameId: details.frameId || undefined
	});

});

/*---------
  Utilities
  ---------*/

const broadcast = function(message) {
	browser.runtime.sendMessage(message, () => browser.runtime.lastError);
};

const setIcon = function(icon) {
	browser.browserAction.setIcon({ path: browser.extension.getURL(icon) });
};

const setBadge = function(count) {
	browser.browserAction.setBadgeText({ text: (count === 0 ? '' : '' + count) });
};

const wrapPromise = function(promise, callback) {
	promise
		.then(result => callback(result))
		.catch(e => callback(e));
};
