const line = (...lines) => { // Returns a line, that passes the given data through the given functions.
	let pipeCount = lines.length;
	let lastReturnValue;
	return async (data) => {
			let i = 0;

			while(lastReturnValue !== false && i < pipeCount)
					lastReturnValue = await lines[i++](data);

			return lastReturnValue;
	};
};

const fix = (...lines) => // Helps in continuing the line with further elements in the input, even when an element blocks the line.
	async (data) => await line(...lines)(data) || undefined;

const invert = (...lines) => // Expects a failure to coninue the line. Helps in incorporating external helpers.
	async (data) => await line(...lines)(data) === false ? undefined : false;

const stop = () => false; // Syntactic sugar, used to signify a break in the line.

const fork = (forkeFn, forkedLine, defaultLine) => async (data) => // Helps in altering between two flows.
	await (await forkeFn(data) === false ? forkedLine : defaultLine)(data);

const check = (fn, ...lines) => async (data) => // Helps in intiiating recovery flows when a line fails.
	fn(data) === false ? await line(...lines)(data) : undefined;

const choose = (choiceFn) => // Helps in choosing the line, based on the passed data. Is usefull in choosing flows within the lines.
	async (data) => await choiceFn(data)(data);

const pass = async (items, ...lines) => { // Helps in queuing items through a line.

	let i = 0, l = items.length;
	let lastReturnValue;

	while(i < l && lastReturnValue !== false)
			lastReturnValue = await line(lines)(items[[i++]]);

	return lastReturnValue;
};

module.exports = {
	line,
	fix,
	invert,
	stop,
	fork,
	check,
	choose,
	pass,
};
