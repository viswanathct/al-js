const { testMembers, expectMockCalls } = require("./helpers");

describe('Functionality of the package.', () => {

	/* Test Targets */
	const { flow, forgive, flip, fail,
		fork, fix, choose, pass, } = require('../src');

	/* Helpers */
	const succeed = () => true;

	/* Mocks */
	const data = Symbol();
	const mRet = { one: Symbol(), two: Symbol() };
	const mFlow = {
		one: jest.fn().mockReturnValue(mRet.one),
		two: jest.fn().mockReturnValue(mRet.two),
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
		expect(await flow(mFlow.one, fail, mFlow.two)(data)).toEqual(false);
		expectMockCalls(mFlow.one)([[data]]);
		expectMockCalls(mFlow.two)([]);
	});

	test('"forgive" should negate failures.', async () => {
		expect(await forgive(fail)()).toEqual(undefined);
		expect(await forgive(succeed)()).toEqual(true);
	});

	test('"flip" should negate bot successes and failures.', async () => {
		expect(await flip(fail)()).toEqual(undefined);
		expect(await flip(succeed)()).toEqual(false);
	});

	test('"fail" should return false, to break the flow.', () => {

		expect(fail()).toEqual(false);
	});

	test('"fork" should continue with the default-flow, when the forkerFn succeeds.', async () => {
		const defaultFlow = mFlow.one;
		const defaultRet = mRet.one;
		const forkedFlow = mFlow.two;

		expect(await fork(succeed, defaultFlow, forkedFlow)(data)).toEqual(defaultRet);
		expectMockCalls(defaultFlow)([[data]]);
		expectMockCalls(forkedFlow)([]);
	});

	test('"fork" should continue with the forked-flow, when the forkerFn fails.', async () => {
		const defaultFlow = mFlow.one;
		const forkedFlow = mFlow.two;
		const forkedRet = mRet.two;

		expect(await fork(fail, defaultFlow, forkedFlow)(data)).toEqual(forkedRet);
		expectMockCalls(defaultFlow)([]);
		expectMockCalls(forkedFlow)([[data]]);
	});

	test('"fix" should not continue with the "resolving flow" when the fixed-function succeeds.', async () => {
		const fixedFn = succeed;
		const resolvingFlow = mFlow.one;

		expect(await fix(fixedFn, resolvingFlow)(data)).toEqual(undefined);
		expect(resolvingFlow).toHaveBeenCalledTimes(0);
	});

	test('"fix" should invoke the "resolving flow" when the fixed-function fails.', async () => {
		expect(await fix(fail, mFlow.one, mFlow.two)(data)).toEqual(mRet.two);
		expectMockCalls(mFlow.one)([[data]]);
		expectMockCalls(mFlow.two)([[data]]);
	});

	test('"choose" should choose the flow based on the return value of the choiceFn.', async () => {
		const choiceFn = (choice) => choice ? mFlow.one : mFlow.two;

		expect(await choose(choiceFn)(true)).toEqual(mRet.one);
		expect(mFlow.one).toHaveBeenCalledTimes(1);
		expect(mFlow.two).toHaveBeenCalledTimes(0);

		jest.clearAllMocks();

		expect(await choose(choiceFn)(false)).toEqual(mRet.two);
		expect(mFlow.one).toHaveBeenCalledTimes(0);
		expect(mFlow.two).toHaveBeenCalledTimes(1);
	});

	test('"pass" should pass the items to the given flows.', async () => {
		const items = [Symbol(), Symbol()];
		const expectation = [[items[0]], [items[1]]];

		expect(await pass(items, mFlow.one, mFlow.two)).toEqual(mRet.two);
		expectMockCalls(mFlow.one)(expectation);
		expectMockCalls(mFlow.two)(expectation);
	});
});
