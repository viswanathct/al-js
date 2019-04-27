const flow = (...flows) => { // Returns a flow, that passes the given data through the given functions.
	const flowCount = flows.length;
	let lastReturnValue;
	return async (data) => {
		let i = 0;

		while(lastReturnValue !== false && i < flowCount)
				lastReturnValue = await flows[i++](data);

		return lastReturnValue;
	};
};

const forgive = (...flows) => // Helps in continuing the flow with further elements in the input, even when an element blocks the flow.
	async (data) => await flow(...flows)(data) || undefined;

const flip = (...flows) => // Expects a failure to coninue the flow. Helps in incorporating external helpers.
	async (data) => await flow(...flows)(data) === false ? undefined : false;

const fail = () => false; // Syntactic sugar, used to signify a break in the flow.

const fork = (forkFn, forkedFlow, defaultFlow) => async (data) => // Helps in altering between two flows.
	await (await forkFn(data) === false ? forkedFlow : defaultFlow)(data);

const fix = (fn, ...flows) => async (data) => // Helps in intiiating recovery flows when a flow fails.
	fn(data) === false ? await flow(...flows)(data) : undefined;

const choose = (choiceFn) => // Helps in choosing the flow, based on the passed data. Is usefull in choosing flows within the flows.
	async (data) => await choiceFn(data)(data);

const pass = async (items, ...flows) => { // Helps in passing a list of items through a flow.
	let i = 0, l = items.length;
	let lastReturnValue;

	while(i < l && lastReturnValue !== false)
		lastReturnValue = await flow(flows)(items[i++]);

	return lastReturnValue;
};

module.exports = {
	flow,
	forgive,
	fork,
	flip,
	fail,
	fix,
	choose,
	pass,
};
