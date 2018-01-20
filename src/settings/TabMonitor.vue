<script>
	export default {

		props: {
			settings: {
				required: true,
				type: Object
			}
		}

	}
</script>

<template>
	<div id="tabMonitor">

		<article class="message is-small">
			<div class="message-header">
				<p>What's this?</p>
			</div>
			<div class="message-body">
				NZBGet Companion polls NZBGet at regular intervals to check its status.
				<br>
				The Default Interval is used when no active downloads are detected (empty download queue).
				<br>
				The Active Interval is used when the download queue contains at least one item (regardless of its status).
				<br>
				Using a higher value for Default Interval can help limit the amount of requests (traffic) sent to NZBGet.
				<br>
				The transition between Default and Active Interval is automatic.
			</div>
		</article>

		<div class="field">
			<div class="field-label">
				<label class="label">Default Interval</label>
			</div>
			<div class="field-body">
				<div class="field has-addons">
					<div class="control">
						<input class="input" type="number" required min="100"
							   v-model="settings.defaultInterval">
					</div>
					<p class="control">
						<a class="button is-static">ms</a>
					</p>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="field-label">
				<label class="label">Active Interval</label>
			</div>
			<div class="field-body">
				<div class="field has-addons">
					<div class="control">
						<input class="input" type="number" required min="100"
							   v-model="settings.activeInterval">
					</div>
					<p class="control">
						<a class="button is-static">ms</a>
					</p>
				</div>
			</div>
		</div>

	</div>
</template>