const { entries } = Object;

const testMembers = (module, Expectations) =>
		entries(Expectations).map(([key, config]) =>
			test(`Member - ${key}`, async () => {
				const member = module[key];

				config.type && expect(member).toEqual(expect.any(config.type));
				config.returns && expect(member()).toEqual(expect.any(config.returns));
				config.test && await config.test(member);
			}));

module.exports = {

	testMembers,
}
