const { testMembers } = require("./helpers");

describe('Functionality of the package', () => {

	const assembly = require('../src');

	const Expectations = {

		line: {
			type: Function,
		},

		fix: {
			type: Function,
		},

		invert: {
			type: Function,
		},

		stop: {
			type: Function,
		},

		fork: {
			type: Function,
		},

		check: {
			type: Function,
		},

		choose: {
			type: Function,
		},

		pass: {
			type: Function,
		},
	};

	beforeEach(() => {

		jest.resetModules()
	});

	/* Main */
	testMembers(assembly, Expectations);
});
