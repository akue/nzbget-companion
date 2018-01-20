<script>
	import ProgressBar from 'progressbar.js';
	import { formatDuration, formatSize } from '../../utils/formatting';

	export default {

		props: [ 'group' ],

		methods: {

			getColor() {
				if (this.group.Status === 'DOWNLOADING') return '#468847';
				else if (this.group.Status === 'PAUSED') return '#f89406';
				else return '#bababa';
			},

			getLabel() {
				const total = this.group.FileSizeMB;
				const downloaded = total - this.group.RemainingSizeMB;
				return `${formatSize(downloaded, true)} / ${formatSize(total, true)}`;
			},

			updateProgress() {
				const percentage = 1 - this.group.RemainingSizeMB / this.group.FileSizeMB;
				this.$progress.setText(this.getLabel());
				this.$progress.animate(percentage);
				this.$progress.path.setAttribute('stroke', this.getColor());
			}

		},

		watch: {
			'group.RemainingSizeMB': function() { this.updateProgress(); },
			'group.Status': function() { this.updateProgress(); }
		},

		mounted() {
			this.$progress = new ProgressBar.Line(this.$el, {
				color: '#76c479',
				duration: 1000,
				easing: 'easeInOut',
				strokeWidth: 6,
				text: { className: 'progressLabel' }
			});
			this.updateProgress();
		}

	}
</script>

<template>
	<div class="progress"></div>
</template>

<style>
	.progress {
		width: 100%;
		height: 20px;
		outline: 1px solid black;
	}

	.progress > svg {
		height: 100%;
	}

	.progressLabel {
		color: black !important;
	}
</style>