[![Build Status](https://travis-ci.org/oceangravity/webskit-gradient-parser.svg?branch=master)](https://travis-ci.org/oceangravity/webskit-gradient-parser)
[![dependencies Status](https://david-dm.org/oceangravity/webskit-gradient-parser.svg)](https://david-dm.org/oceangravity/webskit-gradient-parser)
# WebsKit Gradient Parser

## About

Parse CSS3 gradient definition and returns `JSON` or `object`.

## Demo

[![Edit WebsKit Gradient Parser](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/gradient-parser-bexc5?fontsize=14&hidenavigation=1&theme=dark)


## Examples

```JavaScript
  const gradient = require('webskit-gradient-parser');
  const obj = gradient.parse('repeating-radial-gradient(ellipse 40px 134px at 50% 96%,rgb(0, 165, 223) 0%,rgb(62, 20, 123) 6.6%,rgb(226, 0, 121) 13.2%,rgb(223, 19, 44) 18.8%,rgb(243, 239, 21) 24.1%,rgb(0, 152, 71) 33.3%)', true);
  console.log(JSON.stringify(obj, null, 2));
```

Results in:

```JSON
{
  "type": "repeating-radial-gradient",
  "stops": [
    [
      "rgb(0, 165, 223)",
      "0%"
    ],
    [
      "rgb(62, 20, 123)",
      "6.6%"
    ],
    [
      "rgb(226, 0, 121)",
      "13.2%"
    ],
    [
      "rgb(223, 19, 44)",
      "18.8%"
    ],
    [
      "rgb(243, 239, 21)",
      "24.1%"
    ],
    [
      "rgb(0, 152, 71)",
      "33.3%"
    ]
  ],
  "gradientDefinition": "ellipse 40px 134px at 50% 96%",
  "firstParameterIsColor": false,
  "position": {
    "x": "50%",
    "y": "96%"
  },
  "linearAngle": 0,
  "shape": "ellipse",
  "size": [
    "40px",
    "134px"
  ],
  "conicAngle": 0
}
```

## Install Choices
- `npm i webskit-gradient-parser`

## API

### gradient.parse

Accepts the gradient definitions as it is declared in `background-image` and returns an `JSON` or `object`.

### Options

By default the parser output a `JSON`, but passing `true` as second parameter we can get an `object`.

## License

(The MIT License)

Copyright (c) 2020 Juan Carlos Galindo Navarro ~ webskit.io

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
