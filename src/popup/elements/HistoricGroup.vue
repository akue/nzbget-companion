<script>
	import { distanceInWordsToNow } from 'date-fns';
	import { sendMessage } from '../../utils/misc';
	import { formatDuration, formatRate } from '../../utils/formatting';

	export default {

		props: [ 'group' ],

		methods: {

			formatDuration,

			getDate(group) {
				return distanceInWordsToNow(new Date(group.HistoryTime * 1000), { addSuffix: true });
			},

			getDuration(group) {
				return formatDuration(group.DownloadTimeSec);
			},

			getRate(group) {
				const bytes = (group.DownloadedSizeHi * Math.pow(2, 32)) + group.DownloadedSizeLo;
				const seconds = group.DownloadTimeSec;
				return formatRate(bytes / seconds);
			}

		}

	}
</script>

<template>
	<div class="historicGroup"
		 :class="group.Status.replace(/\/.+$/, '')">

		<div class="groupTitle">
			
			<div class="groupStatus">
				<small>{{group.Status}}</small>
			</div>

			<div class="groupDate">
				<strong>Completed:</strong>
				{{getDate(group)}}
			</div>

			<div class="groupName"
				 :title="group.Name">
				 {{group.Name.replace(/\./g, ' ')}}
			</div>

			<div class="groupStats"
				 v-if="group.Status.startsWith('SUCCESS')">

				<strong>Size:</strong>
				{{group.FileSizeMB}} MB

				/

				<strong>Time:</strong>
				{{getDuration(group)}}

				/

				<strong>Average:</strong>
				{{getRate(group)}}

			</div>

		</div>

	</div>
</template>

<style>
	.historicGroup {
		border: 1px solid black;
		border-radius: 3px
	}

	.historicGroup.SUCCESS {
		padding: 0;
	}

	.historicGroup + .historicGroup {
		margin-top: 0.25rem;
	}

	.historicGroup .groupStatus {
		display: inline-block;
		font-weight: bold;
		border-radius: 3px;
		padding: 1px 4px 2px;
		margin: 0.25rem 0 0 0.25rem;
		vertical-align: bottom;
	}

	.historicGroup .groupDate {
		float: right;
		margin: 0.25rem 0.25rem 0 0;
		line-height: 1.4rem;
	}

	.historicGroup .groupName {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		border-top: 1px dashed #bbb;
		margin-top: 0.25rem;
		margin-left: 0.25rem;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
	}

	.historicGroup .groupStats {
		background: #eee;
		padding: 2px 3px;
	}
	
	.SUCCESS .groupStatus { background: #468847; }
	.WARNING .groupStatus { background: #f89406; }
	.FAILURE .groupStatus { background-color: #b94a48; }
	.DELETED .groupStatus { background-color: #777777; }
</style>
