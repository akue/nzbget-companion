<script>
	import { mapState } from 'vuex';
	import DownloadGroup from '../elements/DownloadGroup.vue';

	export default {

		computed: mapState([
			'error',
			'status',
			'groups',
			'footer'
		]),

		components: {
			DownloadGroup
		}

	}

</script>

<template>
	<div>

		<div id="error" class="redBox" v-if="error">
			<strong>Could not contact NZBGet.</strong>
			<div>Please check your <a @click="openSettings">settings</a>.</div>
		</div>

		<div v-else-if="groups">

			<div id="noDownloads" class="blueBox" v-if="groups && groups.length === 0">
				Nothing to display.
				<div><small>Download queue is empty.</small></div>
			</div>

			<DownloadGroup
					v-for="group in groups"
					:key="group.NZBID"
					:group="group" />

		</div>
		
	</div>
</template>

<style>
	#error > div > a {
		cursor: pointer;
		text-decoration: underline;
	}
</style>