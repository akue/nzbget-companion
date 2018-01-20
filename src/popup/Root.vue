<script>
	import { mapState } from 'vuex';
	import { sendMessage } from '../utils/misc';

	import Header from './Header.vue';
	import MainView from './views/MainView.vue';
	import LogView from './views/LogView.vue';
	import HistoryView from './views/HistoryView.vue';

	export default {

		data() {
			return {
				statusBusy: false
			};
		},

		computed: mapState([
			'status',
			'footer',
			'showingLogs',
			'showingHistory'
		]),

		components: {
			Header,
			MainView,
			LogView,
			HistoryView
		},

		methods: {

			onInit(message) {
				if (!message) message = { };
				this.$store.commit('setStatus', message.status || { });
				this.$store.commit('setGroups', message.groups || [ ]);
				this.$store.commit('setError', message.error);
			},

			onMessage(message) {
				if (!message) message = { };
				if (!message.background) return;
				if (message.status) this.$store.commit('setStatus', message.status);
				if (message.groups) this.$store.commit('setGroups', message.groups);
				if (message.error) this.$store.commit('setError', message.error);
			},

			limitSpeed(kbPerSec) {
				kbPerSec = parseInt(kbPerSec, 10);
				if (isNaN(kbPerSec) || kbPerSec < 0) return;
				this.$store.dispatch('setFooter', 'Sent speed limit change request, please wait...');
				sendMessage({ type: 'limitSpeed', speed: kbPerSec });
			},

			togglePause() {
				if (this.statusBusy) return;
				this.statusBusy = true;
				this.$store.dispatch('setFooter',
					`Sent ${this.status.DownloadPaused ? 'resume' : 'pause'} request, please wait...`);
				sendMessage({ type: 'togglePause' })
					.finally(() => this.statusBusy = false);
			},

			openNZBGet() {
				sendMessage({ type: 'openNZBGet' });
			},

			openSettings() {
				window.location.href = browser.extension.getURL('public/settings.html?embedded');
			}

		},

		mounted() {
			sendMessage({ type: 'popupInit' }).then(this.onInit);
			browser.runtime.onMessage.addListener(this.onMessage);
		},

		beforeDestroy() {
			browser.runtime.onMessage.removeListener(this.onMessage);
		}
	}
</script>

<template>
	<div id="container">

		<Header id="header"></Header>

		<div id="body">
			<MainView v-if="!showingLogs && !showingHistory" />
			<LogView v-else-if="showingLogs" />
			<HistoryView v-else-if="showingHistory" />
		</div>

		<div id="footer" v-if="footer">
			{{footer}}
		</div>
	</div>
</template>

<style>
	body * {
		box-sizing: border-box;
	}

	html, body {
		width: 350px;
		min-height: 100px;
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		padding: 0;
		margin: 0;
		overflow-y: hidden;
	}

	#body {
		margin: 0.5rem;
		max-height: 340px;
		overflow-y: auto;
	}

	#footer {
		padding: 3px 4px;
		color: #545454;
		background: #dcdcdc;
		border-top: 1px solid #bababa;
	}

	/*-----
	  Boxes
	  -----*/

	.blueBox {
		padding: 0.5rem;
		border: 1px solid #bce8f1;
		border-radius: 5px;
		background: #d9edf7;
		color: #31708f;
	}

	.redBox {
		padding: 0.5rem;
		border: 1px solid #ebccd1;
		border-radius: 5px;
		background: #f2dede;
		color: #a94442;
	}

	/* Fix for https://bugzilla.mozilla.org/show_bug.cgi?id=1418677 */
	* {
		background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==);
	}
</style>
