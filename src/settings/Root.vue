<script>
	import Vue from 'vue';
	import { required, numeric, between, minValue } from 'vuelidate/lib/validators';
	import { sendMessage } from '../utils/misc';

	import 'bulma/css/bulma.css';

	import TabServer from './TabServer.vue';
	import TabMonitor from './TabMonitor.vue';
	import TabNotification from './TabNotification.vue';
	import TabGrabbing from './TabGrabbing.vue';

	export default {

		data() {
			return {
				settings: { },
				activeTab: 0,
				saveBusy: false
			};
		},

		methods: {

			persistSettings() {
				if (this.saveBusy) return;
				this.saveBusy = true;
				sendMessage({ type: 'persistSettings', settings: this.settings })
					.finally(() => {
						if (/embedded/.test(window.location.search)) window.history.back();
						else this.saveBusy = false;
					});
			},

			cancel() {
				if (this.saveBusy) return;
				window.history.back();
			}

		},

		components: {
			TabServer,
			TabMonitor,
			TabNotification,
			TabIntegration: TabGrabbing
		},

		mounted() {
			sendMessage({ type: 'readSettings' })
				.then(settings => {
					for (const key in settings)
						Vue.set(this.settings, key, settings[key]);
				});
		},

		validations: {
			settings: {
				host: { required },
				port: { required, numeric, between: between(1, 65535) },
				defaultInterval: { required, minValue: minValue(100) },
				activeInterval: { required, minValue: minValue(100) },
				notificationDuration: { required, minValue: minValue(100) }
			}
		}

	}
</script>

<template>
	<form id="settings">

		<div class="tabs">
			<ul>
				<li :class="{ 'is-active': activeTab === 0 }" @click="activeTab = 0">
					<a>NZBGet</a>
				</li>
				<li :class="{ 'is-active': activeTab === 1 }" @click="activeTab = 1">
					<a>Monitor</a>
				</li>
				<li :class="{ 'is-active': activeTab === 2 }" @click="activeTab = 2">
					<a>Notifications</a>
				</li>
				<li :class="{ 'is-active': activeTab === 3 }" @click="activeTab = 3">
					<a>Grabbing</a>
				</li>
			</ul>
		</div>

		<div id="tabContainer">
			<TabServer :settings="settings" v-show="activeTab === 0" />
			<TabMonitor :settings="settings" v-show="activeTab === 1" />
			<TabNotification :settings="settings" v-show="activeTab === 2" />
			<TabIntegration :settings="settings" v-show="activeTab === 3" />
		</div>

		<hr>

		<div class="right-align" id="buttonContainer">
			<img id="loadingSpinner" :src="iconLoading" v-show="saveBusy">
			<button class="button is-danger" type="button"
					:disabled="saveBusy"
					@click="cancel">
				Cancel
			</button>
			<button class="button is-primary" id="saveButton" type="button"
					:disabled="saveBusy || $v.$invalid"
					@click="persistSettings">
				Save
			</button>
		</div>

	</form>
</template>

<style>
	html, body {
		width: 100%;
		height: 100%;
		background: #eeeeee !important;
	}

	html {
		font-family: 'Roboto', sans-serif !important;
		font-size: 13px !important;
	}

	#settings {
		width: 350px;
		margin: auto;
		background: white;
	}

	.tabs {
		margin-bottom: 0 !important;
	}

	#tabContainer,
	#buttonContainer {
		padding: 1rem;
	}

	.right-align {
		text-align: right;
	}

	hr {
		margin: 0 !important;
	}

	#loadingSpinner {
		max-height: 15px;
		margin-top: 7px;
		margin-right: 5px;
	}
</style>
