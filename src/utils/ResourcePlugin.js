const getAsset = (url => browser.extension.getURL(url));

const iconsURL = getAsset('assets/icons.png');

export default {

    install(Vue) {
		Vue.prototype.icons = iconsURL;
        Vue.prototype.iconCircleWorking = getAsset('assets/working_circle.png');
        Vue.prototype.iconCirclePaused = getAsset('assets/paused_circle.png');
        Vue.prototype.iconLoading = getAsset('assets/loading.gif');
        Vue.prototype.iconGrabber = getAsset('assets/icon_grabber.png');
	}
	
}

export const iconsDirective = {
    bind(element) {
        element.style.backgroundImage = `url('${iconsURL}')`;
    }
};