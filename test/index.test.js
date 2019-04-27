const { testMembers, peek } = require("./helpers");

describe('Functionality of the package', () => {

	const assembly = require('../src');
	const { fail } = assembly;
	const pass = () => true;

	const Expectations = {

		flow: {
			type: Function,
			returns: Function,
			test: async (fn) => {
				const flow1 = jest.fn();
				const ret2 = Symbol();
				const flow2 = jest.fn().mockReturnValue(ret2);
				const data = Symbol();

				expect(await fn(flow1, flow2)(data)).toEqual(ret2);
				expect(flow1).toHaveBeenCalledTimes(1);
				expect(flow1).toBeCalledWith(data);
				expect(flow2).toHaveBeenCalledTimes(1);
				expect(flow2).toBeCalledWith(data);

				jest.clearAllMocks();

				expect(await fn(flow1, fail, flow2)(data)).toEqual(false);
				expect(flow1).toHaveBeenCalledTimes(1);
				expect(flow1).toBeCalledWith(data);
				expect(flow2).toHaveBeenCalledTimes(0);
			},
		},

		forgive: {
			type: Function,
			returns: Function,
			test: async (fn) => {
				expect(await fn(fail)()).toEqual(undefined);
				expect(await fn(pass)()).toEqual(true);
			},
		},

		flip: {
			type: Function,
			returns: Function,
			test: async (fn) => {
				expect(await fn(fail)()).toEqual(undefined);
				expect(await fn(pass)()).toEqual(false);
			},
		},

		fail: {
			type: Function,
			test: (fn) => expect(fn()).toEqual(false),
		},

		fork: {
			type: Function,
			test: async (fn) => {
				const defaultRet = Symbol();
				const defaultFlow = jest.fn().mockReturnValue(defaultRet);
				const forkerdRet = Symbol();
				const forkedFlow = jest.fn().mockReturnValue(forkerdRet);
				const data = Symbol();

				expect(await fn(pass, defaultFlow, forkedFlow)(data)).toEqual(defaultRet);
				expect(defaultFlow).toHaveBeenCalledTimes(1);
				expect(defaultFlow).toBeCalledWith(data);
				expect(forkedFlow).toHaveBeenCalledTimes(0);

				jest.clearAllMocks();

				expect(await fn(fail, defaultFlow, forkedFlow)(data)).toEqual(forkerdRet);
				expect(defaultFlow).toHaveBeenCalledTimes(0);
				expect(forkedFlow).toHaveBeenCalledTimes(1);
				expect(forkedFlow).toBeCalledWith(data);
			},
		},

		fix: {
			type: Function,
			test: async (fn) => {
				const ret1 = Symbol();
				const flow1 = jest.fn().mockReturnValue(ret1);
				const ret2 = Symbol();
				const flow2 = jest.fn().mockReturnValue(ret2);
				const data = Symbol();

				expect(await fn(pass, flow1)(data)).toEqual(undefined);
				expect(flow1).toHaveBeenCalledTimes(0);

				jest.clearAllMocks();

				expect(await fn(fail, flow1, flow2)(data)).toEqual(ret2);
				expect(flow1).toHaveBeenCalledTimes(1);
				expect(flow1).toBeCalledWith(data);
				expect(flow2).toHaveBeenCalledTimes(1);
				expect(flow1).toBeCalledWith(data);
			},
		},

		choose: {
			type: Function,
			test: async (fn) => {
				const ret1 = Symbol();
				const flow1 = jest.fn().mockReturnValue(ret1);
				const ret2 = Symbol();
				const flow2 = jest.fn().mockReturnValue(ret2);
				const choiceFn = (choice) => choice ? flow1 : flow2;

				expect(await fn(choiceFn)(true)).toEqual(ret1);
				expect(flow1).toHaveBeenCalledTimes(1);
				expect(flow2).toHaveBeenCalledTimes(0);

				jest.clearAllMocks();

				expect(await fn(choiceFn)(false)).toEqual(ret2);
				expect(flow1).toHaveBeenCalledTimes(0);
				expect(flow2).toHaveBeenCalledTimes(1);
			},
		},

		pass: {
			type: Function,
			test: async (fn) => {
				const ret1 = Symbol();
				const flow1 = jest.fn().mockReturnValue(ret1);
				const ret2 = Symbol();
				const flow2 = jest.fn().mockReturnValue(ret2);
				const data = [1, 2];

				expect(await fn(data, flow1, flow2)).toEqual(ret2);
				expect(flow1.mock.calls).toEqual([[1], [2]]);
				expect(flow2.mock.calls).toEqual([[1], [2]]);
			},
		},
	};

	/* Main */
	testMembers(assembly, Expectations);
});
