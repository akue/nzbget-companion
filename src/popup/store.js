import Vue from 'vue';
import { debounce } from '../utils/misc';

export default {

	/*-----
	  State
	  -----*/

	state: {

		// Will contain the last error encountered when interacting with the server if any
		error: null,

		// Will contain the status as returned by the status() method
		status: { },

		// Will contain the group list as returned by the listgroups() method
		groups: [ ],

		// Will contain the message displayed in the popup's footer
		footer: null,

		// Will contain the debounced function used to clear the footer
		footerClear: null,

		// True if the main view is visible
		showingMain: true,

		// True if the log view is visible
		showingLogs: false,

		// True if the history view is visible
		showingHistory: false

	},

	/*---------
	  Mutations
	  ---------*/

	mutations: {

		// Mutates the error
		setError(state, error) {
			state.error = error;
		},

		// Mutates the status
		setStatus(state, status) {
			for (const key in status) {
				if (!state.status.hasOwnProperty(key))
					Vue.set(state.status, key, status[key]);
				else
					state.status[key] = status[key];
			}
		},

		// Mutates the groups
		setGroups(state, groups) {
			state.groups.splice(0, state.groups.length, ...groups);
		},

		// Mutates the footer
		setFooter(state, footer) {
			state.footer = footer;
		},

		// Shows the main view
		showMain(state) {
			state.showingMain = true;
			state.showingLogs = state.showingHistory = false;
		},

		// Toggles the log view visibility
		toggleLogs(state) {
			state.showingLogs = !state.showingLogs;
			state.showingHistory = !state.showingLogs && state.showingHistory;
			state.showingMain = !state.showingLogs && !state.showingHistory;
		},

		// Toggles the history view visibility
		toggleHistory(state) {
			state.showingHistory = !state.showingHistory;
			state.showingLogs = !state.showingHistory && state.showingLogs;
			state.showingMain = !state.showingLogs && !state.showingHistory;
		}

	},

	/*-------
	  Actions
	  -------*/

	actions: {

		setFooter({ state, commit }, footer) {
			commit('setFooter', footer);
			if (!state.footerClear)
				state.footerClear = debounce(() => state.footer = null, 2500);
			state.footerClear();
		}

	}

};