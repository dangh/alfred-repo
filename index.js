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

let repoUrl = alfy.cache.get(packageName);
if (repoUrl) {
	showResult(repoUrl);
} else {
	alfy
		.fetch(`https://api.npms.io/v2/package/${packageName}`, {
			json: true,
			transform: body => body.collected.metadata.links.repository
		})
		.then(repoUrl => {
			alfy.cache.set(packageName, repoUrl, {maxAge: ONE_MONTH});
			showResult(repoUrl);
		});
}
