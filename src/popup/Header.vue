<script>
	import { mapState } from 'vuex';
	import { formatDuration, formatRate } from '../utils/formatting';

	export default {

		data() {
			return {
				showSpeedOptions: false,
				speedLimit: null
			};
		},

		watch: {
			'status.DownloadLimit': function() {
				if (this.speedLimit === null)
					this.speedLimit = Math.round(this.status.DownloadLimit / 1024);
			}
		},

		computed: {

			...mapState([
				'showingMain',
				'status',
				'groups'
			]),

			isActive() {
				if (this.isPaused) return false;
				if (this.status.DownloadRate > 0) return true;
				if (!this.groups) return false;
				return this.groups.some(g => g.Status === 'DOWNLOADING' || g.Status === 'QUEUED');
			},

			isPaused() {
				return (this.status.DownloadPaused === true);
			},

			isLimited() {
				return (this.status.DownloadLimit > 0);
			},

			speed() {
				return formatRate(this.status.DownloadRate || 0);
			},

			eta() {
				const left = (this.status.RemainingSizeMB || 0) ;
				const rate = (this.status.DownloadRate || 0) / 1024 / 1024;
				if (left === 0 || rate === 0) return 'N/A';
				else return formatDuration(left / rate);
			}

		},

		methods: {

			toggleControls() {
				this.showSpeedOptions = !this.showSpeedOptions;
				if (this.showSpeedOptions) this.$refs.speedControl.focus();
			},

			changeSpeed() {
				this.$parent.limitSpeed(this.speedLimit);
				this.toggleControls();
			},

			toggleLogs() {
				this.$store.commit('toggleLogs');
			},

			toggleHistory() {
				this.$store.commit('toggleHistory');
			}

		}

	}
</script>

<template>
	<div :class="{ active: isActive, paused: isPaused, limited: isLimited, showControls: showSpeedOptions }">

		<div id="headerBar">

			<a id="backButton"
			   @click="$store.commit('showMain')" v-show="!showingMain">
				<strong>&#8249;</strong>
				Back
			</a>

			<div id="speedContainer" @click="toggleControls()" v-show="showingMain">
				<span v-icons id="speedIcon" />
				<span id="speedText">{{speed}}</span>
			</div>

			<div id="etaContainer" v-show="showingMain">
				<span v-icons id="etaIcon" />
				<span id="etaText">{{eta}}</span>
			</div>

			<div id="iconContainer">
				<div v-icons id="logsButton" @click="toggleLogs" tooltip="Logs" />
				<div v-icons id="historyButton" @click="toggleHistory" tooltip="History" />
				<div v-icons id="nzbGetButton" @click="$parent.openNZBGet" tooltip="Open NZBGet" />
				<div v-icons id="settingsButton" @click="$parent.openSettings" tooltip="Settings" />
			</div>

		</div>

		<div v-icons id="statusButton"
			 v-show="showingMain"
			 @click="$parent.togglePause">
			<div v-icons id="statusArrow"></div>
			<img id="statusSpinner" :src="isPaused ? iconCirclePaused : iconCircleWorking">
		</div>

		<div id="speedControl" v-show="showingMain">
			<span>Limit speed to:</span>
			<input type="number" step="1"
				   ref="speedControl"
				   v-model="speedLimit"
				   @keypress.enter="changeSpeed">
			<span>KB/s</span>
		</div>

	</div>
</template>

<style>

	/*------
	  Header
	  ------*/

	#headerBar {
		background: #2B2B2B;
		width: 350px;
		height: 42px;
		color: white;
		font-size: 12px;
		position: relative;
	}

	/*-----------
	  Header Text
	  -----------*/

	#headerBar span {
		display: inline-block;
		vertical-align: middle;
	}

	#speedContainer, #etaContainer {
		display: inline-block;
		margin-top: 13px;
		vertical-align: middle;
	}

	#speedContainer {
		margin-left: 75px;
		cursor: pointer;
	}

	#speedIcon {
		width: 16px;
		height: 16px;
		background-position: -176px -48px;
	}

	.limited #speedIcon {
		background-position: -208px -48px;
	}

	#speedText {
		margin-left: 5px;
		width: 50px;
	}

	#etaContainer {
		margin-left: 10px;
	}

	#etaIcon {
		width: 16px;
		height: 16px;
		background-position: -112px -16px;
		display: inline-block;
	}

	#etaText {
		margin-left: 5px;
	}

	/*-------------
	  Speed Control
	  -------------*/

	#speedControl {
		background: #ddd;
		width: 350px;
		height: 0px;
		overflow: hidden;
		white-space: nowrap;
		padding-left: 75px;
		margin-bottom: 1.25rem;
		line-height: 25px;
		transition: height 0.125s linear, margin-bottom 0.125s linear;
	}

	.showControls #speedControl {
		height: 25px;
		margin-bottom: 0.5rem;
	}

	#speedControl > span {
		background: #ddd;
		border: none;
		margin: 0;
		padding: 0;
	}

	#speedControl, #speedControl > input {
		font-size: 0.9rem;
	}

	#speedControl > input {
		width: 60px;
		height: 21px;
		margin-left: 5px;
		margin-right: 5px;
		-moz-appearance: textfield;
	}

	#speedControl > input::-webkit-outer-spin-button,
	#speedControl > input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Fixes some annoying Firefox glitch */
	#speedControl > span:last-child {
		width: 100%;
		display: inline-block;
	}

	/*-------------
	  Status Button
	  -------------*/

	#statusButton {
		width: 50px;
		height: 50px;
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		background-position: -176px -80px;
		cursor: pointer;
	}

	.active #statusButton {
		background-position: -112px -80px;
	}

	#statusArrow {
		width: 21px;
		height: 21px;
		background-position: -16px -80px;
		position: absolute;
		top: 14px;
		left: 14px;
	}

	#statusButton:hover > #statusArrow {
		background-position: -16px -112px;
	}

	#statusSpinner {
		display: none;
		width: 70px;
		height: 70px;
		position: absolute;
		top: -10px;
		left: -10px;
		pointer-events: none;
		-webkit-animation: rotation 1s linear infinite;
		-moz-animation: rotation 1s linear infinite;
		-ms-animation: rotation 1s linear infinite;
	}

	.active #statusSpinner,
	.paused #statusSpinner {
		display: block;
	}

	/*-----------
	  Back Button
	  -----------*/

	#backButton {
		cursor: pointer;
		line-height: 40px;
		margin-left: 15px;
	}

	/*--------------
	  Header Buttons
	  --------------*/

	#iconContainer {
		position: absolute;
		right: 13px;
		top: 13px;
	}

	#iconContainer > div {
		width: 16px;
		height: 16px;
		cursor: pointer;
		display: inline-block;
	}

	#historyButton {
		background-position: -400px -48px;
	}

	#logsButton {
		background-position: -464px -47px;
	}

	#nzbGetButton {
		background-position: -368px -48px;
	}

	#settingsButton {
		background-position: -433px -48px;
	}

	/*--------
	  Tooltips
	  --------*/
	  
	[tooltip] {
		position: relative;
  		cursor: pointer;
	}

	[tooltip]:before {
		content: attr(tooltip);
		position: absolute;
		top: 150%;
		right: 0;
		padding: 5px 7px;
		border-radius: 3px;
		-moz-border-radius: 3px;
		-webkit-border-radius: 3px;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		text-align: center;
		white-space: nowrap;
	}

	[tooltip]:before,
	[tooltip]:after {
		visibility: hidden;
		opacity: 0;
		pointer-events: none;
	}

	[tooltip]:hover:before,
	[tooltip]:hover:after {
		visibility: visible;
		opacity: 1;
	}

	/*----------
	  Animations
	  ----------*/

	@-webkit-keyframes rotation {
		0% { -webkit-transform: rotate(0); }
		100% { -webkit-transform: rotate(360deg); }
	}

	@-moz-keyframes rotation {
		0% { -moz-transform: rotate(0); }
		100% { -moz-transform: rotate(360deg); }
	}

	@-ms-keyframes rotation {
		0% { -ms-transform: rotate(0); }
		100% { -ms-transform: rotate(360deg); }
	}

</style>
