# Assembly JS

  A simple set of utililties to help with building assembly lines in JS.

## Why?

* Assembly lines help in implementing complex flows, in a manner -- easy to comprehend and maintain.

## Keys

* Every input to a line is passed to the functions sequentially.

* Returning false from a function in a line, affects the flow of the all downstream lines.

* The utilities could be combined to achieve complex flows.

## Notes

* The name line, is a delibarate choice, to prevent confusing them with traditional pipes.

* Assembly lines are similar to unix pipes, builder pattern and the pipe-filter pattern from functional languages. Yet, there are some differentiators.

* Assembly lines pass the same entity to all the functions in a line. They do not pass their return values downstream (like pipes).

* Builder pattern has a specific purpose, where as assembly lines are meant to help in managing flows.

* When a flow looks complex, break it into sub-flows.

## ToDo

* Support async lines to process items parallelly.

* Write some examples and include a few of them in the ReadMe.
