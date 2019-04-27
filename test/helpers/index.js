const { entries } = Object;

const testMembers = (module, Expectations) =>
		entries(Expectations).map(([key, config]) =>
			test(`Member - ${key}`, () => {
				const member = module[key];

				expect(member).toEqual(expect.any(config.type));
			}));

module.exports = {

	testMembers,
}
