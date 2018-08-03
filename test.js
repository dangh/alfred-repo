import test from 'ava';
import alfyTest from 'alfy-test';

test(async t => {
	const alfy = alfyTest();
	const result = await alfy('n');

	t.deepEqual(result, [
		{
			title: 'Open n repo',
			subtitle: 'https://github.com/tj/n',
			arg: 'https://github.com/tj/n'
		}
	]);
});
