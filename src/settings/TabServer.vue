<script>
	import { sendMessage } from '../utils/misc';

	export default {

		props: {
			settings: {
				required: true,
				type: Object
			}
		},

		data() {
			return {
				test: {
					busy: false,
					result: null,
					version: null,
					error: null
				}
			};
		},

		methods: {

			testConnection() {

				if (this.test.busy) return;
				this.test.busy = true;

				sendMessage({ type: 'testConnection', settings: this.settings })
					.then(version => {
						this.test.result = true;
						this.test.version = version;
					})
					.catch(e => {
						this.test.result = false;
						this.test.error = `${response.error.name}: ${response.error.message}`;
					})
					.finally(() => {
						this.test.busy = false;
					});

			}

		}

	}
</script>

<template>
	<div id="tabServer">

		<div class="field">
			<div class="field-label">
				<label class="label">HTTPS</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox"
								   v-model="settings.useHTTPS">
							Use HTTPS
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="field-label">
				<label class="label">Host</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<input class="input" type="text" required
							   v-model="settings.host">
					</div>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="field-label">
				<label class="label">Port</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<input class="input" type="number" required
							   min="1" max="65535" step="1"
							   v-model="settings.port">
					</div>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="field-label">
				<label class="label">Username</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<input class="input" type="text"
							   v-model="settings.username">
					</div>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="field-label">
				<label class="label">Password</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<input class="input" type="password"
							   v-model="settings.password">
					</div>
				</div>
			</div>
		</div>

		<div class="right-align">
			<button class="button is-small is-info" id="testButton" type="button"
					:disabled="test.busy || $parent.$v.$invalid"
					@click="testConnection">
				Test Connection
			</button>
		</div>

		<div class="notification is-success" v-if="test.result === true">
			Connection successful.
			<small><strong>NZBGet v{{test.version}}</strong> detected.</small>
		</div>

		<div class="notification is-danger" v-if="test.result === false">
			Connection failed.
			<small>{{test.error}}</small>
		</div>

	</div>
</template>

<style>
	.notification {
		margin-top: 0.5rem;
		padding: 0.5rem 1rem !important;
	}

	.notification > small {
		display: block;
	}

	.field-label {
		text-align: left;
	}
</style>