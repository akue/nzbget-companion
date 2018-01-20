<script>
	import { format } from 'date-fns';
	import { sendMessage } from '../../utils/misc';

	export default {

		data() {
			return {
				working: true,
				logs: [ ],
				error: null,
			};
		},

		methods: {

			getDate(log) {
				return format(new Date(log.Time * 1000), 'ddd MMM d YYYY HH:mm:ss');
			}

		},

		mounted() {
			sendMessage({ type: 'logs' })
				.then(logs => this.logs = logs.reverse())
				.catch(e => this.error = e)
				.finally(() => this.working = false)
		}

	}
</script>

<template>
	<div>

		<div id="fetchingLogs" class="blueBox" v-show="working">
			<img id="loadingSpinner" :src="iconLoading">
			Reading logs...
		</div>

		<div id="noLogs" class="blueBox" v-if="logs.length === 0">
			Nothing to display.
			<div><small>Log queue is empty.</small></div>
		</div>

		<div id="logs" v-else>
			<div class="log" v-for="log in logs" :key="log.ID">
				<div class="logBadge" :class="log.Kind">{{log.Kind}}</div>
				<div class="logDate">{{getDate(log)}}</div>
				<div class="logText">{{log.Text}}</div>
			</div>
		</div>

		<div class="redBox" v-if="error">
			Could not read logs.
			<div v-if="error.message"><small>{{error.message}}</small></div>
		</div>

	</div>
</template>

<style>
	#fetchingLogs > #loadingSpinner {
		width: 16px;
		height: 16px;
		mix-blend-mode: multiply;
		vertical-align: bottom;
	}

	.log {
		border: 1px solid black;
		padding: 0.25rem;
	}

	.log + .log {
		margin-top: 0.25rem;
	}

	.logBadge {
		padding: 1px 4px 2px;
		border-radius: 3px;
		color: white;
		font-weight: bold;
		white-space: nowrap;
	}

	.logText {
		border-top: 1px dashed #bbb;
		margin-top: 2px;
		padding-top: 2px;
	}

	.logBadge, .logDate {
		display: inline-block;
	}

	.logBadge { background-color: #777777; }
	.logBadge.INFO { background-color: #468847; }
	.logBadge.WARNING { background-color: #f89406; }
	.logBadge.ERROR { background-color: #b94a48; }
</style>
