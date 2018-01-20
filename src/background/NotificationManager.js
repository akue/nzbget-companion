import { formatSize } from '../utils/formatting';

export default class NotificationManager {

	constructor(settings, statusManager) {

		this._settings = settings || { };
		this._statusManager = statusManager;
		this._groups = null;

		statusManager.on('groups', g => this.onGroups(g));
		statusManager.on('error', e => this.onError(e));

	}

	updateSettings(settings) {
		Object.assign(this._settings, settings || { });
	}

	/*----------------
	  Status Callbacks
	  ----------------*/

	onGroups(groups) {
		const previousGroups = this._groups;
		this._groups = groups;
		if (previousGroups !== null)
			this._examineGroups(previousGroups);
	}

	onError(error) {
		this._groups = null;
	}

	/*----------------
	  Internal Methods
	  ----------------*/

	_createNotification(id, title, message) {
		const data = { type: 'basic', title, message, iconUrl: 'assets/notification_icon.png' };
		data.message = data.message.trim().replace(/^\s+/mg, '');
		browser.notifications.create('' + id, data);
		setTimeout(() => browser.notifications.clear('' + id), this._settings.notificationDuration);
	}

	_examineGroups(previousGroups) {

		const previousIDs = previousGroups.map(g => g.NZBID);
		const newIDs = this._groups.map(g => g.NZBID);

		const newGroups = this._groups.filter(g => previousIDs.indexOf(g.NZBID) === -1);
		const removedIDs = previousIDs.filter(id => newIDs.indexOf(id) === -1);

		this._notifyNewGroups(newGroups);
		this._notifyRemovedGroups(removedIDs);

	}

	_notifyNewGroups(groups) {
		if (groups.length === 0 || !this._settings.addedNotification)
			return;
		groups.forEach(g => {
			this._createNotification(g.NZBID, 'New Download Detected', `
				${g.NZBName.replace(/\./g, ' ')}
				Size: ${formatSize(g.FileSizeMB, true)}
				Category: ${g.Category || '(none)'}
			`);
		});
	}

	_notifyRemovedGroups(ids) {
		// Abort if there are no groups to check
		if (ids.length === 0)
			return;
		// Abort if the user is not interested in any notification this method can raise
		const s = this._settings;
		if (!s.successNotification && !s.warningNotification && !s.failureNotification && !s.deletedNotification)
			return;
		// Otherwise, start a new history() request
		this._statusManager.history()
			.then(groups => groups.filter(g => g.Kind === 'NZB' && ids.indexOf(g.NZBID) !== -1))
			.then(groups => {

				groups.forEach(g => {

					// Message is the same for all notifications
					const message = `
						${g.NZBName.replace(/\./g, ' ')}
						Size: ${formatSize(g.FileSizeMB, true)}
						Category: ${g.Category || '(none)'}
						Status: ${g.Status}
					`;

					if (/^SUCCESS/.test(g.Status) && s.successNotification)
						this._createNotification(g.NZBID, 'Download Completed', message);
					else if (/^WARNING/.test(g.Status) && s.warningNotification)
						this._createNotification(g.NZBID, 'Download Completed With Warnings', message);
					else if (/^FAILURE/.test(g.Status) && s.failureNotification)
						this._createNotification(g.NZBID, 'Download Failed', message);
					else if (/^DELETED/.test(g.Status) && s.deletedNotification)
						this._createNotification(g.NZBID, 'Download Deleted', message);

				});
			});

	}

}