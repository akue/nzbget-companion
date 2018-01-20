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
	<div id="tabGrabbing">

		<article class="message is-small">
			<div class="message-header">
				<p>What's this?</p>
			</div>
			<div class="message-body">
				When download grabbing is enabled, NZBGet Companion will inject a small script into every page you visit
				to detect links to *.NZB files.
				The script will  add a <img :src="iconGrabber"> button next to every detected link that will automatically
				send the NZB file to NZBGet for processing when clicked.
			</div>
		</article>

		<article class="message is-small is-danger">
			<div class="message-header">
				<p>Warning</p>
			</div>
			<div class="message-body">
				This is very much a beta feature, it may not work at all.
			</div>
		</article>

		<div class="field no-margin">
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox"
								   v-model="settings.grabbingEnabled">
							<span>Enable download grabbing</span>
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
								   v-model="settings.grabbingTop"
								   :disabled="!settings.grabbingEnabled">
							<span>Add grabbed downloads to the top of the queue</span>
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
								   v-model="settings.grabbingPaused"
								   :disabled="!settings.grabbingEnabled">
							<span>Add grabbed downloads in paused state</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="field no-margin">
			<div class="field-label">
				<label class="label">Priority for Grabbed Downloads</label>
			</div>
			<div class="field-body">
				<div class="field" id="selectContainer">
					<div class="control">
						<div class="select">
							<select v-model="settings.grabbingPriority"
									:disabled="!settings.grabbingEnabled">
								<option value="-100">Very Low</option>
								<option value="-50">Low</option>
								<option value="0">Normal</option>
								<option value="50">High</option>
								<option value="100">Very High</option>
								<option value="900">Force</option>
							</select>
						</div>
					</div>
					<span class="help" v-show="settings.grabbingPriority == 900">
						Downloads with <strong>Force</strong> priority will be
						<br>
						started even when NZBGet is paused.
					</span>
				</div>
			</div>
		</div>

		<div class="field no-margin">
			<div class="field-label">
				<label class="label">Category for Grabbed Downloads</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<input class="input" type="text"
							   v-model="settings.grabbingCategory"
							   :disabled="!settings.grabbingEnabled">
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<style>
	#selectContainer > .control,
	#selectContainer > .help {
		display: inline-block;
		vertical-align: middle;
	}

	#tabGrabbing .help {
		line-height: 1;
		margin: 0;
		padding: 0;
	}

	#tabGrabbing img {
		vertical-align: bottom;
	}
</style>
