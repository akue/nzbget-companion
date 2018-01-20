/*------------------------------------------------------
  The detection and parsing algorithms for Newznab-based
  indexers are based on the ones used by SABconnect++
  https://github.com/gboudreau/sabconnectplusplus

  Newznab detection:
  https://github.com/gboudreau/sabconnectplusplus/blob/master/scripts/pages/newznab-check.js

  Newznab parsing:
  https://github.com/gboudreau/sabconnectplusplus/blob/master/scripts/content/newznab.js
  ------------------------------------------------------*/

import { createButton, grabDownload } from '../utils.js';

export default {

	isEnabled() {
		if (document.querySelector('[name="RSSTOKEN"]')) return true;
		if (document.querySelector('input.nzb_multi_operations_cart')) return true;
		if (document.querySelector('#browsetable tr ~ tr > td.item label:first-child')) return true;
		return false;
	},

	parseDOM() {
		parseCoverView();
		parseListView();
		parseDetailsView();
	}

}

/*--------------------------
  Internal Methods (Parsing)
  --------------------------*/

function parseCoverView() {
	const selector = '#coverstable > tbody > tr ~ tr, #browselongtable > tbody > tr ~ tr';
	[ ...document.querySelectorAll(selector) ].forEach(target => {
		if (target.hasAttribute('nzbgc')) return;
		target.setAttribute('nzbgc', 'true');
		[ ...target.querySelectorAll('div.icon_nzb') ].forEach(parseDetailsView);
	});
}

function parseListView() {
	[ ...document.querySelectorAll('td.check') ].forEach(target => {

		if (target.hasAttribute('nzbgc')) return;
		target.setAttribute('nzbgc', 'true');

		const link = target.parentNode.querySelector('.icon_nzb a[href]');
		const title = target.parentNode.querySelector('a.title');
		if (!link || !title) return;

		const button = createButton(() => onButtonClick(link.href, title.textContent.trim()));
		title.parentNode.insertBefore(button, title);

	});
}

function parseDetailsView(target) {
	const root = (target || document);
	[ ...root.querySelectorAll('div.icon_nzb') ].forEach(target => {

		if (target.hasAttribute('nzbgc')) return;
		target.setAttribute('nzbgc', 'true');

		const link = target.querySelector('a[href]');
		if (!link) return;
			
		const container = document.createElement('div');
		container.className = 'icon';
		container.appendChild(createButton(() => onButtonClick(link.href, null)));

		target.parentNode.insertBefore(container, target);

	});
}

/*---------------------------
  Internal Methods (Grabbing)
  ---------------------------*/

function onButtonClick(href, filename) {
	grabDownload(decorateURL(href), filename);
}

function decorateURL(url) {
	
	const parsed = new URL(url);
	const search = new URLSearchParams(parsed.search);

	const uid = document.querySelector('[name="UID"]');
	if (uid) search.set('i', uid.value);

	const rss = document.querySelector('[name="RSSTOKEN"]');
	if (rss) search.set('r', uid.value);

	const searchString = search.toString();
	return parsed.toString().replace(/\?.+$/, '') + (searchString ? '?' + searchString : '');

}
