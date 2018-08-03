'use strict';
const alfy = require('alfy');
const Fuse = require('fuse.js');

const ONE_MONTH = 30 * 24 * 3600 * 1000;
const SUGGESTIONS_KEY = '#suggestions';

let pkgName = (alfy.input || '').trim().toLowerCase();

let getPackageManifestUrl = pkgName => {
	return pkgName.startsWith('@') ?
		`https://registry.npmjs.org/${pkgName}` :
		`https://registry.npmjs.org/${pkgName}/latest`;
};

let extractRepositoryUrl = manifest => {
	let url = (manifest.repository && manifest.repository.url) ||
		(manifest.bugs && manifest.bugs.url) ||
		manifest.homepage ||
		`https://npmjs.org/package/${manifest.name}`;
	url = url.replace(/^git(\+(ssh|https))?:\/\/(git@)?/, 'https://');
	url = url.replace(/\.git$/, '');
	url = url.replace(/\/issues\/?$/, '');
	url = url.replace(/#.*/, '');
	return url;
};

let suggestions = new Proxy(alfy.cache.get(SUGGESTIONS_KEY) || {}, {
	set(target, prop, value) {
		target[prop] = value;
		alfy.cache.set(SUGGESTIONS_KEY, target, {maxAge: ONE_MONTH});
		return true;
	}
});

let getSuggestions = (pkgName = '') => {
	let all = Object.entries(suggestions).map(x => ({
		title: x[0],
		subtitle: x[1].replace('https://github.com/', ''),
		arg: x[1]
	}));

	if (pkgName === '') {
		return all;
	}

	let fuse = new Fuse(all, {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: ['title']
	});

	return fuse.search(pkgName);
};

if ((pkgName === '') || (pkgName in suggestions)) {
	// show recent items when user haven't key in any name,
	// or we already have it in the cache
	alfy.output(getSuggestions(pkgName));
} else {
	alfy
		.fetch(getPackageManifestUrl(pkgName), {
			timeout: 3000,
			transform: extractRepositoryUrl,
			maxAge: ONE_MONTH
		})
		.then(
			repoUrl => {
				suggestions[pkgName] = repoUrl;
				alfy.output(getSuggestions(pkgName));
			},
			err => {
				alfy.output([
					{
						title: err.stack ? `${err.name}: ${err.message}` : err,
						subtitle: 'Press ⌘L to see the full error and ⌘C to copy it.',
						valid: false,
						text: {
							copy: err.stack,
							largetype: err.stack
						},
						icon: {
							path: alfy.icon.error
						}
					},
					...getSuggestions(pkgName)
				]);
			}
		);
}
