simple-pivot-table
======================

This simple but powerful React UI library generates Pivot Tables based on the rows and values selected in the input.

## Install

You can install with [npm]:

```sh
$ npm install --save simple-pivot-table
```

## Usage

The library is self documented in a Storybook here:

https://webdacjs.github.io/simple-pivot-table/?path=/story/pivottable--default

Please browse it and discover all the different usecases supported but the simplest usage is to import the `PivotTable` module and pass the `data`, `rows` and `values` parameters.

The `data` parameter can be a JSON object or a CSV string, the `rows` are the fields to aggregate over and the `values` are the fields summarised with the required aggregator (ie. sum or avg) and an optional formatter. ie:

```js

import { PivotTable } from 'simple-pivot-table'

export default function testcomponent ({data, rows, vals}) {

    return (
         <PivotTable
            data={data}
            rows={rows}
            values={values} />
    )

}

```

### License

Copyright © 2021, [Juan Convers](https://juanconvers.com).
Released under the [MIT License](LICENSE).

