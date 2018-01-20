import xmlToJs from 'xml-js';

import EventEmitter from 'wolfy87-eventemitter';
import ApiHandler from './ApiHandler';

export default class StatusManager
		extends EventEmitter {

	constructor(settings) {

		super();

		this._settings = settings
		this._apiHandler = new ApiHandler(settings);
		this._timeout = null;
		this._version = 0;

		this._status = null;
		this._groups = null;
		this._error = null;

		this._fetchData();

	}

	updateSettings(settings) {
		if (!this._shouldReset(settings)) return Promise.resolve();
		Object.assign(this._settings, settings || { });
		this._apiHandler = new ApiHandler(this._settings);
		return this._forceFetch();
	}

	/*-----------
	  Data Access
	  -----------*/

	status() {
		return { ...this._status };
	}

	groups() {
		return JSON.parse(JSON.stringify(this._groups));
	}

	error() {
		return this._error;
	}

	/*------------------
	  Derived Properties
	  ------------------*/

	isPaused() {
		return this._error === null && this._status.DownloadPaused === true;
	}

	isWorking() {
		return !this.isPaused() && this._status.ServerStandBy === false;
	}

	hasDataLeftToDownload() {
		return this._error === null && this._status && (this._status.RemainingSizeLo > 0 || this._status.RemainingSizeHi > 0);
	}

	/*------------
	  Read Methods
	  ------------*/

	history() {
		return this._apiHandler.history();
	}

	logs(numberOfEntries) {
		return this._apiHandler.log(numberOfEntries);
	}

	/*---------------
	  Control Methods
	  ---------------*/

	limitSpeed(speed) {
		return this._apiHandler.rate(speed);
	}

	togglePause() {
		const promise = (this.isPaused() ? this._apiHandler.resumeDownload() : this._apiHandler.pauseDownload());
		return promise.finally(() => this._forceFetch());
	}

	toggleGroup(group) {
		const command = (group.Status === 'PAUSED' ? 'GroupResume' : 'GroupPause');
		const result = this._apiHandler.editQueue(command, '', [ group.NZBID ]);
		result.finally(() => this._forceFetch());
		return result;
	}

	appendDownload(filename, contents) {

		if (!filename) {
			filename = this._deduceFilename(contents).replace(/\s/g, '.');
			if (!/\.nzb$/.test(filename)) filename += '.nzb';
		}

		const encodedContents = btoa(contents);
		const category = this._settings.grabbingCategory || '';
		const priority = parseInt(this._settings.grabbingPriority, 10) || 0;
		const addToTop = !!this._settings.grabbingTop;
		const addPaused = !!this._settings.grabbingPaused;

		return this._apiHandler.append(filename, encodedContents, category, priority, addToTop, addPaused);

	}

	/*----------------
	  Internal Methods
	  ----------------*/

	_shouldReset(newSettings) {
		return [ 'useHTTPS', 'host', 'port', 'username', 'password' ].some(property => {
			return this._settings[property] !== newSettings[property];
		});
	}

	_forceFetch() {
		clearTimeout(this._timeout);
		++this._version;
		return this._fetchData();
	}

	_fetchData() {

		const version = this._version;
		const hadDataLeft = this.hasDataLeftToDownload();
		const promises = [ this._apiHandler.status() ];
		if (this._groups === null || this._groups.length > 0 || this.hasDataLeftToDownload())
			promises.push(this._apiHandler.listGroups());

		return Promise.all(promises)
			.then(results => this._onSuccessfulRequest(results, version))
			.catch(e => this._onFailedRequest(e, version))
			.then(isSuccess => {

				if (version !== this._version) return;

				// If we just transitioned from standby to working, immediately start a new request to get the new groups
				// Otherwise, use the appropriate interval
				let timeout;
				if (isSuccess && !hadDataLeft && this.hasDataLeftToDownload()) timeout = 0;
				else timeout = this._settings[isSuccess && this.hasDataLeftToDownload() ? 'activeInterval' : 'defaultInterval'];

				this._timeout = setTimeout(() => this._fetchData(), timeout);

			});

	}

	_deduceFilename(nzbContents) {
		try {

			const json = xmlToJs.xml2js(nzbContents, { compact: true });

			// Check if it has a title metadata
			if (json.nzb && json.nzb.head && json.nzb.head && json.nzb.head.meta) {
				let meta = json.nzb.head.meta;
				if (meta.constructor === Object) meta = [ meta ];
				const title = meta.filter(m => m._attributes && m._attributes.type === 'title');
				if (title.length > 0 && title[0]._text.trim().length)
					return title[0]._text.trim();
			}

		} catch (e) {
			console.error('Could not deduce filename', e);
		}

		return `NZBGet.Companion.${new Date().toISOString()}.nzb`;

	}

	/*----------------
	  Callback Methods
	  ----------------*/

	_onSuccessfulRequest(results, version) {
		if (version !== this._version)
			return;
		// Emit status
		this._status = results[0];
		this.emit('status', this._status);
		// Emit groups (if requested)
		if (results[1]) {
			this._groups = results[1];
			this.emit('groups', this._groups);
		}
		// Emit error (if changed)
		if (this._error !== null) {
			this._error = null;
			this.emit('error', null);
		}
		return true;
	}

	_onFailedRequest(error, version) {
		if (version !== this._version) return;
		console.error('Request failed', error);
		this._status = this._groups = null;
		this._error = error;
		this.emit('error', error);
		return false;
	}

};