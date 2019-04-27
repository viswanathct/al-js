const { testMembers } = require("./helpers");

describe('Functionality of the package', () => {

	const assembly = require('../src');

	const Expectations = {

		flow: {
			type: Function,
		},

		forgive: {
			type: Function,
		},

		flip: {
			type: Function,
		},

		fail: {
			type: Function,
		},

		fork: {
			type: Function,
		},

		fix: {
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
