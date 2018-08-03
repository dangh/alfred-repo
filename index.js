'use strict';
const alfy = require('alfy');

const ONE_MONTH = 30 * 24 * 3600 * 1000;

let packageName = alfy.input.toLowerCase();

let showResult = repoUrl => {
	alfy.output([
		{
			title: `Open ${packageName} repo`,
			subtitle: repoUrl,
			arg: repoUrl
		}
	]);
};

let getPackageManifestUrl = packageName => {
	return packageName.startsWith('@') ?
		`https://registry.npmjs.org/${packageName}` :
		`https://registry.npmjs.org/${packageName}/latest`;
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

let repoUrl = alfy.cache.get(packageName);
if (repoUrl) {
	showResult(repoUrl);
} else {
	alfy
		.fetch(getPackageManifestUrl(packageName), {
			json: true,
			timeout: 3000,
			transform: extractRepositoryUrl
		})
		.then(repoUrl => {
			alfy.cache.set(packageName, repoUrl, {maxAge: ONE_MONTH});
			showResult(repoUrl);
		});
}
