<script>
	export default {

		props: {
			settings: {
				required: true,
				type: Object
			}
		},

		methods: {

			createNotification() {
				browser.notifications.create('exampleNotification', {
					type: 'basic',
					title: 'Example Notification',
					message: 'Example',
					iconUrl: 'assets/notification_icon.png'
				});
				setTimeout(() => browser.notifications.clear('exampleNotification'), this.settings.notificationDuration);
			}

		}

	}
</script>

<template>
	<div id="tabNotification">

		<label class="label">Raise a notification when:</label>

		<div class="field no-margin">
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox"
								   v-model="settings.addedNotification">
							<span>A new download is detected</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="field no-margin">
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox"
								   v-model="settings.successNotification">
							<span>A download completes successfully</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="field no-margin">
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox"
								   v-model="settings.warningNotification">
							<span>A download completes with warnings</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="field no-margin">
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox"
								   v-model="settings.failureNotification">
							<span>A download fails</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox"
								   v-model="settings.deletedNotification">
							<span>A download is deleted</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="field-label">
				<label class="label">Notification Duration</label>
			</div>
			<div class="field-body">
				<div class="field has-addons">
					<div class="control">
						<input class="input" type="number" required min="100"
							   v-model="settings.notificationDuration">
					</div>
					<p class="control">
						<a class="button is-static">ms</a>
					</p>
				</div>
			</div>
		</div>

		<div class="right-align">
			<button class="button is-small is-info" type="button"
					@click="createNotification">
				See Notification Example
			</button>
		</div>

	</div>
</template>

<style>
	#tabNotification .field.no-margin {
		margin-bottom: 0;
	}

	#tabNotification span {
		position: relative;
		bottom: 1px;
	}

	#tabNotification [type="checkbox"] {
		margin-right: 5px;
	}
</style>