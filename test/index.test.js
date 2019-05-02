const { expectMockCalls } = require("./helpers");

describe('Functionality of the package.', () => {

	/* Test Targets */
	const { flow, forgive, flip, fail,
		fork, fix, follow, feed, } = require('../src');

	/* Helpers */
	const asyncSucceed = async () => true;
	const asyncFail = async () => false;

	/* Mocks */
	const data = Symbol();
	const mRet = { one: Symbol(), two: Symbol() };
	const mFlow = {
		one: jest.fn().mockImplementation(() => Promise.resolve(mRet.one)),
		two: jest.fn().mockImplementation(() => Promise.resolve(mRet.two)),
	};

	/* Setup */
	beforeEach(() => jest.clearAllMocks());

	/* Tests */
	test('"flow" should call sub-flows in sequence.', async () => {
		expect(await flow(mFlow.one, mFlow.two)(data)).toEqual(mRet.two);
		expectMockCalls(mFlow.one)([[data]]);
		expectMockCalls(mFlow.two)([[data]]);
	});

	test('"flow" should stop and return false when a sub-flow fails.', async () => {
		expect(await flow(mFlow.one, asyncFail, mFlow.two)(data)).toEqual(false);
		expectMockCalls(mFlow.one)([[data]]);
		expectMockCalls(mFlow.two)([]);
	});

	test('"forgive" should negate failures.', async () => {
		expect(await forgive(asyncFail)()).toEqual(undefined);
		expect(await forgive(asyncSucceed)()).toEqual(true);
	});

	test('"flip" should negate bot successes and failures.', async () => {
		expect(await flip(asyncFail)()).toEqual(undefined);
		expect(await flip(asyncSucceed)()).toEqual(false);
	});

	test('"fail" should return false, to break the flow.', () => {

		expect(fail()).toEqual(false);
	});

	test('"fork" should continue with the default-flow, when the forkerFn succeeds.', async () => {
		const defaultFlow = mFlow.one;
		const defaultRet = mRet.one;
		const altFlow = mFlow.two;

		expect(await fork(asyncSucceed, defaultFlow, altFlow)(data)).toEqual(defaultRet);
		expectMockCalls(defaultFlow)([[data]]);
		expectMockCalls(altFlow)([]);
	});

	test('"fork" should continue with the alt-flow, when the forkerFn fails.', async () => {
		const defaultFlow = mFlow.one;
		const altFlow = mFlow.two;
		const altRet = mRet.two;

		expect(await fork(asyncFail, defaultFlow, altFlow)(data)).toEqual(altRet);
		expectMockCalls(defaultFlow)([]);
		expectMockCalls(altFlow)([[data]]);
	});

	test('"fork" should work without an alt-flow.', async () => {
		const defaultFlow = mFlow.one;
		const defaultRet = mRet.one;

		expect(await fork(asyncSucceed, defaultFlow)(data)).toEqual(defaultRet);
		expectMockCalls(defaultFlow)([[data]]);
	});

	test('"fix" should not continue with the "resolving flow" when the fixed-function succeeds.', async () => {
		const fixedFn = asyncSucceed;
		const resolvingFlow = mFlow.one;

		expect(await fix(fixedFn, resolvingFlow)(data)).toEqual(undefined);
		expect(resolvingFlow).toHaveBeenCalledTimes(0);
	});

	test('"fix" should invoke the "resolving flow" when the fixed-function fails.', async () => {
		expect(await fix(asyncFail, mFlow.one, mFlow.two)(data)).toEqual(mRet.two);
		expectMockCalls(mFlow.one)([[data]]);
		expectMockCalls(mFlow.two)([[data]]);
	});

	test('"follow" should follow the flow returned by the choiceFn.', async () => {
		const choiceFn = (choice) => choice ? mFlow.one : mFlow.two;

		expect(await follow(choiceFn)(true)).toEqual(mRet.one);
		expect(mFlow.one).toHaveBeenCalledTimes(1);
		expect(mFlow.two).toHaveBeenCalledTimes(0);

		jest.clearAllMocks();

		expect(await follow(choiceFn)(false)).toEqual(mRet.two);
		expect(mFlow.one).toHaveBeenCalledTimes(0);
		expect(mFlow.two).toHaveBeenCalledTimes(1);
	});

	test('"feed" should feed the items to the given flows.', async () => {
		const items = [Symbol(), Symbol()];
		const expectation = [[items[0]], [items[1]]];

		expect(await feed(items, mFlow.one, mFlow.two)).toEqual(mRet.two);
		expectMockCalls(mFlow.one)(expectation);
		expectMockCalls(mFlow.two)(expectation);
	});
});
