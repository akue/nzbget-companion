import { merge } from './DefaultConfig';
import { xhr } from '../utils/misc';

export default class ApiHandler {

    /*-----------
      Constructor
      -----------*/

    constructor(config) {
        this._config = merge(config);
    }

    /*--------------
      Public Methods
      --------------*/

    // https://nzbget.net/api/version
    version() { return this._request('version'); }

    // https://nzbget.net/api/status
    status() { return this._request('status'); }

    // https://nzbget.net/api/listgroups
    listGroups() { return this._request('listgroups', [ 0 ]); }

    // https://nzbget.net/api/history
    history() { return this._request('history', [ false ]); }

    // https://nzbget.net/api/pausedownload
    pauseDownload() { return this._request('pausedownload'); }

    // https://nzbget.net/api/resumedownload
    resumeDownload() { return this._request('resumedownload'); }

    // https://nzbget.net/api/rate
	rate(limit) { return this._request('rate', [ limit ]); }

	// https://nzbget.net/api/editqueue
	editQueue(command, param, ids) {
		return this._request('editqueue', [ command, param, ids ]);
	}

	// https://nzbget.net/api/append
	append(filename, content, category, priority, addToTop, addPaused) {
		return this._request('append', [
			filename, content, category, priority, addToTop, addPaused, '', 0, 'all', [ ]
		]);
    }
    
    // https://nzbget.net/api/log
    log(numberOfEntries) {
        return this._request('log', [ 0, numberOfEntries ]);
    }

    /*----------------
      Internal Methods
      ----------------*/

    _buildRequestURL() {
        const config = this._config;
        const protocol = (config.useHTTPS ? 'https' : 'http');
        return `${protocol}://${config.host}:${config.port}/${config.username}:${config.password}/jsonrpc`;
    }

    _request(method, params) {
        const id = '' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        const body = JSON.stringify({ version: '1.1', method, params, id });
        return xhr('POST', this._buildRequestURL(), body)
			.catch(e => {
				return Promise.reject({ code: -1, message: e.message, name: 'HTTPError' });
			})
            .then(xhr => {
                if (xhr.status < 400) return JSON.parse(xhr.responseText);
                return Promise.reject({ code: xhr.status, message: xhr.responseText, name: 'HTTPError' });
            })
            .then(response => {
                if (response.error) return Promise.reject(response.error);
                else return response.result;
            })
    }

}
