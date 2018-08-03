import test from 'ava';
import alfyTest from 'alfy-test';

function testCase(pkgName, expected) {
	test(pkgName, async t => {
		const alfy = alfyTest();
		const result = await alfy(pkgName);
		t.deepEqual(result, expected);
	});
}

testCase('n', [
	{
		title: 'n',
		subtitle: 'tj/n',
		arg: 'https://github.com/tj/n'
	}
]);

testCase('pacote', [
	{
		title: 'pacote',
		subtitle: 'zkat/pacote',
		arg: 'https://github.com/zkat/pacote'
	}
]);

test('suggestions', async t => {
	const alfy = alfyTest();
	alfy.cache.set('#suggestions', {
		p: 'https://github.com/dscape/p',
		pacote: 'https://github.com/zkat/pacote'
	});
	const result = await alfy('');
	t.deepEqual(result, [
		{
			title: 'p',
			subtitle: 'dscape/p',
			arg: 'https://github.com/dscape/p'
		},
		{
			title: 'pacote',
			subtitle: 'zkat/pacote',
			arg: 'https://github.com/zkat/pacote'
		}
	]);
});
