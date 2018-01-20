<script>
	import { sendMessage } from '../../utils/misc';
	import HistoricGroup from '../elements/HistoricGroup.vue';

	export default {

		data() {
			return {
				working: true,
				history: [ ],
				error: null
			};
		},

		components: {
			HistoricGroup
		},

		mounted() {
			sendMessage({ type: 'history' })
				.then(history => {
					history.sort((a, b) => b.HistoryTime - a.HistoryTime)
					this.history = history.slice(-25);
				})
				.catch(e => this.error = e)
				.finally(() => this.working = false)
		}

	}
</script>

<template>
	<div>

		<div id="fetchingHistory" class="blueBox" v-show="working">
			<img id="loadingSpinner" :src="iconLoading">
			Reading history...
		</div>

		<div id="noHistory" class="blueBox" v-if="history.length === 0">
			Nothing to display.
			<div><small>Download history is empty.</small></div>
		</div>

		<div id="history" v-else>
			<HistoricGroup
					v-for="group in history"
					:key="group.NZBID"
					:group="group" />
		</div>

		<div class="redBox" v-if="error">
			Could not read history.
			<div v-if="error.message"><small>{{error.message}}</small></div>
		</div>

	</div>
</template>
