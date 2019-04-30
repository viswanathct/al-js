# Assembly Line a.k.a. ffffff

	A simple set of utililties, to help with building assembly lines in JS.

## The `Why`

* Assembly lines help in implementing complex flows, in a manner -- easy to comprehend and maintain.
* Considerably improves readability.
* Allows for a hybrid-approach, by bringing together concepts from FP and Non-FP patterns.

## Example
```js
/* Feed a list of Orders into a flow. */
feed(Orders, flow(
	verifyStock,
	verifyPayment,
	dispatch,
	sendMail,
));

/* The is equivalent of the above, in plain JS, would be really messy. */
```
**For more examples, check the [examples](https://github.com/viswanathct/al-js/tree/master/examples) dir**.
```sh
# Or run
$ node ./examples/cheatsheet.js
```

## Installation
```sh
$ npm install ffffff
```

## Use Cases

* Data pipelines.

* Asset pipelines.

* Complex business flows.

## Keys

* Simple functions are stiched together to compose complex flows.

* The same object is passed to all the functions in a flow, as the only argument.

* Returning false from a function, affects the flow of the all downstream functions(there are ways to change the behaviour).

## Notes

* The name flow, is a delibarate choice, to prevent confusing them with traditional pipes.

* Assembly lines are similar to unix pipes, builder pattern and the pipe-filter pattern from functional languages. Yet, there are some key differentiators:

	* Assembly lines feed the same entity to all the functions in a flow. They do not feed their return values downstream (like pipes / pipes-and-filters).

	* Builder pattern has a specific purpose, building a complex object; where as assembly lines are meant to be a generic pattern in managing complex flows, which might include the building of complex objects.

* When a flow looks complex, break it into sub-flows.

* The package name **ffffff** represents the primary utilitiy functions of the library. The lack of availability of the name -- **assembly-line, al-js and their likes** -- with NPM played a part in choosing such an odd name. There are a few more reasons to the name:

	* ***False** plays a key role in controling the flow.*

	* The lib is all about functions.

	* All the key functions start with the letter, **F**.

	* *And **ffffff** is also the hex code of white.*

# Development

## Setup
```sh
$ sh ./setup.sh
```

## ToDo

* Support async flows to process items parallelly.

* Write some examples and include a few of them in the ReadMe.

* Add some example bots. Especially, a batcher, a timer and an apiFetcher.

* Port the package to other languages, esp. to Python.

* If possible, write tests for the cheatsheet example.

* Document the API.
