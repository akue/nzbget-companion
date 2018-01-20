export function round(n) {
	return Math.round(n * 100) / 100;
}

export function formatRate(bytesPerSec) {
	if (bytesPerSec >= 1048576)
		return round(bytesPerSec / 1024 / 1024) + ' MB/s';
	else if (bytesPerSec >= 1024)
		return round(bytesPerSec / 1024) + ' KB/s';
	else
		return bytesPerSec + ' B/s';
}

export function formatSize(megabytes, addSuffix) {
	const result = (megabytes < 1024 ? megabytes : round(megabytes / 1024));
	if (!addSuffix) return megabytes;
	else return `${result} ${megabytes < 1024 ? 'MB' : 'GB'}`;
}

export function formatDuration(seconds) {
	if (seconds >= 86400)
		return Math.round(seconds / 86400) + 'd';
	else if (seconds >= 21600)
		return Math.round(seconds / 3600) + 'h';
	else if (seconds >= 3600)
		return Math.floor(seconds / 3600) + 'h ' + Math.round((seconds % 3600) / 60) + 'm';
	else if (seconds >= 60)
		return Math.round(seconds / 60) + 'm';
	else
		return seconds + 's';
}