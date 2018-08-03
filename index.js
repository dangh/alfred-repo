'use strict';
const alfy = require('alfy');

alfy
	.fetch(`https://api.npms.io/v2/package/${alfy.input}`, {
		json: true,
		transform: body => body.collected.metadata.links.repository
	})
	.then(repoUrl =>
		alfy.output([
			{
				title: `Open ${alfy.input} repo`,
				subtitle: repoUrl,
				arg: repoUrl
			}
		])
	);
