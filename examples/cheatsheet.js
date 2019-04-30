/**
 * The cheatsheet.
 */

const { flow, forgive, fork, flip,
	fail, fix, follow, feed,
} = require('../src');

/* Helpers */
const { log, runExamples } = require('./helpers');

/* Data */
const orders = [
	{
		product: 'shoes',
		price: 10,
		quantity: 1,
	},
	{
		product: 'apples',
		price: 20,
		quantity: 10,
	},
];
const stock = {
	shoes: 10,
	apples: 5,
}

/* Flows */
const verifyStock = (order) => {
	const isInStock = stock[order.product] >= order.quantity;
	log(`${order.product} ${ isInStock ? 'in' : 'out of'} stock!`);
	return isInStock;
}
const procureProduct = (order) => log(`Procuring ${order.quantity} ${order.product}.`);
const calculateTotal = (order) => {
	log('Calculating total...');
	order.total = order.quantity * order.price;
}
const dispatchProduct = (order) => log(`Dispatching ${order.quantity} ${order.product}.`)
const doNothing = () => {};

/* Examples */
const examples = {

	'A simple flow': async () => {

		await feed(orders, flow(
			calculateTotal,
			dispatchProduct,
		))
	},

	'A simple flow with validation': async () => {

		await feed(orders, flow(
			verifyStock, // The flow breaks when validation fails.
			calculateTotal,
			dispatchProduct,
		));
	},

	'A flow with forgive': async () => {

		await feed(orders, flow(
			forgive(verifyStock), // Forgive helps in continuing the flow, despite failure.
			calculateTotal,
			dispatchProduct,
		));
	},

	'A flow with a fix': async () => {

		await feed(orders, flow(
			fix(verifyStock, procureProduct), //procureProduct is called only when verifyStock fails.
			calculateTotal,
			dispatchProduct,
		));
	},

	'A flow with a fork': async () => {

		const completeDispatch = flow(calculateTotal, dispatchProduct); //NOTE: Flows could be combined.

		await feed(orders, flow(
			fork(verifyStock,
				completeDispatch, // The pass case.
				procureProduct // The fail case.
			),
		));
	},

	'A flow with a flip': async () => {
		const reversedOrders = orders.reverse();

		await feed(reversedOrders, flow(
			flip(verifyStock), //Fix excpects a failure to proceed. This is partly due to to help while leveraging third-party functions.
			procureProduct,
		));
	},

	'A flow with a fail': async () => {

		await feed(orders, flow(
			fix(verifyStock, procureProduct, fail), // Fails stops the flow. The fucntion is a syntactic-sugar, as well as an aid to improve readability.
			calculateTotal,
			dispatchProduct,
		));
	},

	'A flow with a follow': async () => {

		await feed(orders, flow(
			follow(
				(order) => verifyStock(order) ?  procureProduct : doNothing // Choose a path to follow, on the fly.
			),
			calculateTotal,
			dispatchProduct,
		));
	},
};

/* Main */
runExamples(examples);

module.exports = {
	examples,
}
