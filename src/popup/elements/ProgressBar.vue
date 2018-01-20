<script>
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

			updateBar() {
				const percentage = 1 - this.group.RemainingSizeMB / this.group.FileSizeMB;
				this.$refs.label.textContent = this.getLabel();
				this.$refs.bar.style.width = (percentage * 100) + '%';
				this.$refs.bar.style.backgroundColor = this.getColor();
			}

		},

		watch: {
			'group.RemainingSizeMB': function() { this.updateBar(); },
			'group.Status': function() { this.updateBar(); }
		},

		mounted() {
			this.updateBar();
		}

	}
</script>

<template>
	<div class="progress">
		<div class="progressBar" ref="bar"></div>
		<div class="progressLabel" ref="label"></div>
	</div>
</template>

<style>
	.progress {
		width: 100%;
		height: 20px;
		outline: 1px solid black;
		position: relative;
	}

	.progressBar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 0;
		background-color: #76c479;
		transition: width 0.25s ease-in-out, background-color 0.5s linear;
	}

	.progressLabel {
		color: black !important;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
