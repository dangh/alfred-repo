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
		title: 'Open n repo',
		subtitle: 'https://github.com/tj/n',
		arg: 'https://github.com/tj/n'
	}
]);

testCase('pacote', [
	{
		title: 'Open pacote repo',
		subtitle: 'https://github.com/zkat/pacote',
		arg: 'https://github.com/zkat/pacote'
	}
]);
