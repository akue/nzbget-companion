import { debounce } from '../../utils/misc';
import grabbers from './grabbers';

(function() {
	
	/**
	 * Invoked when the current page has finished loading.
	 */
	function onPageReady() {

		const activeGrabbers = grabbers.filter(grabber => grabber.isEnabled());
		if (activeGrabbers.length === 0) return;

		// Initialize grabbers
		for (let i=0; i<activeGrabbers.length; ++i) {
			try {
				if (activeGrabbers[i].onInit) activeGrabbers[i].onInit();
				activeGrabbers[i].parseDOM();
			} catch (e) {
				console.error('Failed to initialize NZBGet Grabber', e);
				activeGrabbers.splice(i--, 1);
			}
		}

		// Add DOM parse hook
		const debouncedParse = debounce(() => activeGrabbers.forEach(g => g.parseDOM()), 100);
		document.addEventListener('DOMNodeInserted', debouncedParse);

	}

	if (document.readyState === 'complete') onPageReady();
	else window.addEventListener('load', onPageReady);

})();
