<script>
	import ProgressBar from './ProgressBar.vue';
	import { sendMessage } from '../../utils/misc';

	export default {

		props: [ 'group' ],

		data() {
			return {
				toggleBusy: false
			};
		},

		methods: {

			toggleGroupStatus() {
				if (this.toggleBusy) return;
				this.toggleBusy = true;
				this.$store.dispatch('setFooter',
					`Sent download ${this.group.Status === 'PAUSED' ? 'resume' : 'pause'} request, please wait...`);
				sendMessage({ type: 'toggleGroupStatus', group: this.group })
					.finally(() => this.toggleBusy = false);
			}

		},

		components: {
			ProgressBar
		}

	}
</script>

<template>
	<div class="group">

		<div class="groupTitle">

			<div class="groupName"
				 :title="group.NZBName">
				{{group.NZBName.replace(/\./g, ' ')}}
			</div>

			<div class="groupStatus"
				 :class="group.Status"
				 @click="toggleGroupStatus(group)">
				<small>{{group.Status}}</small>
			</div>

		</div>

		<ProgressBar :group="group" />

	</div>
</template>

<style>
	.group {
		margin-bottom: 0.25rem;
		padding: 0.25rem;
		border: 1px solid black;
	}

	.group > .groupTitle {
		margin-bottom: 5px;
		display: flex;
	}

	.group .groupName {
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 18px;
	}

	.group .groupStatus {
		display: inline-block;
		font-weight: bold;
		border-radius: 5px;
		padding: 1px 4px 2px;
		color: white;
		background: #bababa;
		cursor: pointer;
	}

	.group .DOWNLOADING {
		background: #468847;
	}

	.group .PAUSED {
		background: #f89406;
	}
</style>
