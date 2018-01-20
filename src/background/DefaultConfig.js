const defaultConfig = {

	useHTTPS: false,
	host: 'localhost',
	port: 6789,
	username: 'nzbget',
	password: 'password',

	defaultInterval: 5000,
	activeInterval: 2000,

	addedNotification: false,
	successNotification: false,
	warningNotification: false,
	failureNotification: false,
	deletedNotification: false,
	notificationDuration: 5000,

	grabbingEnabled: false,
	grabbingTop: false,
	grabbingPaused: false,
	grabbingPriority: 0,
	grabbingCategory: ''

};

Object.freeze(defaultConfig);

/*-------
  Exports
  -------*/

export default defaultConfig;

export function merge(config) {
	const result = (config || { });
	for (const key in defaultConfig) {
		if (!result.hasOwnProperty(key) || result[key] === undefined)
			result[key] = defaultConfig[key];
	}
	return result;
}
