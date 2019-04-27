# Assembly Line a.k.a. ffffff

  A simple set of utililties to help with building assembly lines in JS.

## Why?

* Assembly lines help in implementing complex flows, in a manner -- easy to comprehend and maintain.

## Example
```js
pass(Orders, flow(
	verifyStock,
	verifyPayment,
	dispatch,
	sendMail,
));
```

## Setup
```sh
$ sh ./setup.sh
```

## Keys

* Every input to a flow is passed to the functions sequentially.

* Returning false from a function in a flow, affects the flow of the all downstream functions.

* The utilities could be combined to achieve complex flows.

## Notes

* The name flow, is a delibarate choice, to prevent confusing them with traditional pipes.

* Assembly lines are similar to unix pipes, builder pattern and the pipe-filter pattern from functional languages. Yet, there are some key differentiators.

	* Assembly lines pass the same entity to all the functions in a flow. They do not pass their return values downstream (like pipes / pipes-and-filters).

	* Builder pattern has a specific purpose, building a complex object; where as assembly lines are meant to be a generic pattern in managing complex flows, which might include the building of complex objects.

* When a flow looks complex, break it into sub-flows.

* The package name **ffffff** represents the primary utilitiy functions of the library. The lack of availability of the name -- **assembly-line**, **al-js** and their likes -- with NPM played a part in choosing such an odd name. There are a few more reasons to the name:

	* ***False** plays a key role in controling the flow.*

	* The lib deals a lot with functions.

	* *And **ffffff** is also the hex code of white.*

## ToDo

* Support async flows to process items parallelly.

* Write some examples and include a few of them in the ReadMe.

* Add some example bots. Especially a batcher and a timer.

* Port the package to other languages, esp. to Python.
