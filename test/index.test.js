const { testMembers, expectMockCalls } = require("./helpers");

describe('Functionality of the package', () => {

	const assemblyLine = require('../src');

	/* Helpers */
	const { fail } = assemblyLine;
	const pass = () => true;

	/* Mocks */
	const data = Symbol();
	const mRet = { one: Symbol(), two: Symbol() };
	const mFlow = {
		one: jest.fn().mockReturnValue(mRet.one),
		two: jest.fn().mockReturnValue(mRet.two),
	};

	/* Config */
	const Expectations = {

		flow: {
			type: Function,
			returns: Function,
			test: async (testedFn) => {
				expect(await testedFn(mFlow.one, mFlow.two)(data)).toEqual(mRet.two);
				expectMockCalls(mFlow.one)([[data]]);
				expectMockCalls(mFlow.two)([[data]]);

				jest.clearAllMocks();

				expect(await testedFn(mFlow.one, fail, mFlow.two)(data)).toEqual(false);
				expectMockCalls(mFlow.one)([[data]]);
				expectMockCalls(mFlow.two)([]);
			},
		},

		forgive: {
			type: Function,
			returns: Function,
			test: async (testedFn) => {
				expect(await testedFn(fail)()).toEqual(undefined);
				expect(await testedFn(pass)()).toEqual(true);
			},
		},

		flip: {
			type: Function,
			returns: Function,
			test: async (testedFn) => {
				expect(await testedFn(fail)()).toEqual(undefined);
				expect(await testedFn(pass)()).toEqual(false);
			},
		},

		fail: {
			type: Function,
			test: (fn) => expect(fn()).toEqual(false),
		},

		fork: {
			type: Function,
			test: async (testedFn) => {
				const defaultRet = Symbol();
				const defaultFlow = jest.fn().mockReturnValue(defaultRet);
				const forkedRet = Symbol();
				const forkedFlow = jest.fn().mockReturnValue(forkedRet);

				expect(await testedFn(pass, defaultFlow, forkedFlow)(data)).toEqual(defaultRet);
				expectMockCalls(defaultFlow)([[data]]);
				expectMockCalls(forkedFlow)([]);

				jest.clearAllMocks();

				expect(await testedFn(fail, defaultFlow, forkedFlow)(data)).toEqual(forkedRet);
				expectMockCalls(defaultFlow)([]);
				expectMockCalls(forkedFlow)([[data]]);
			},
		},

		fix: {
			type: Function,
			test: async (testedFn) => {
				expect(await testedFn(pass, mFlow.one)(data)).toEqual(undefined);
				expect(mFlow.one).toHaveBeenCalledTimes(0);

				jest.clearAllMocks();

				expect(await testedFn(fail, mFlow.one, mFlow.two)(data)).toEqual(mRet.two);
				expectMockCalls(mFlow.one)([[data]]);
				expectMockCalls(mFlow.two)([[data]]);
			},
		},

		choose: {
			type: Function,
			test: async (testedFn) => {
				const choiceFn = (choice) => choice ? mFlow.one : mFlow.two;

				expect(await testedFn(choiceFn)(true)).toEqual(mRet.one);
				expect(mFlow.one).toHaveBeenCalledTimes(1);
				expect(mFlow.two).toHaveBeenCalledTimes(0);

				jest.clearAllMocks();

				expect(await testedFn(choiceFn)(false)).toEqual(mRet.two);
				expect(mFlow.one).toHaveBeenCalledTimes(0);
				expect(mFlow.two).toHaveBeenCalledTimes(1);
			},
		},

		pass: {
			type: Function,
			test: async (testedFn) => {
				const items = [Symbol(), Symbol()];
				const expectation = [[items[0]], [items[1]]];

				expect(await testedFn(items, mFlow.one, mFlow.two)).toEqual(mRet.two);
				expectMockCalls(mFlow.one)(expectation);
				expectMockCalls(mFlow.two)(expectation);
			},
		},
	};

	/* Main */
	beforeEach(() => jest.clearAllMocks());
	testMembers(assemblyLine, Expectations);
});
