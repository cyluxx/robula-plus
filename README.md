# Robula+
Robula+ is an algorithm to generate robust XPath-based locators, that are likely to work correctly with new releases of a web application. Robula+ reduces the locators' fragility on average by 90% w.r.t. absolute locators and by 63% w.r.t. Selenium IDE locators [[1]](#about).

[![Build Status](https://travis-ci.org/cyluxx/robula-plus.svg?branch=master)](https://travis-ci.org/cyluxx/robula-plus)

## Usage
### getRobustXPath(element, document):
Returns an optimized robust XPath locator string.

Parameter | Type | Description
--------- | ---- | -----------
element | Element | The desired element.
document | Document | The document to analyse, that contains the desired element.

*Returns:* A robust xPath locator string, describing the desired element.

### getElementByXPath(xPath, document):
Returns an element in the given document located by the given xPath locator.

Parameter | Type | Description
--------- | ---- | -----------
xPath | string | A xPath string, describing the desired element.
document | Document | The document to analyse, that contains the desired element.

*Returns:* The first maching Element located.

### uniquelyLocate(xPath, element, document):
Returns, wheater an xPath describes only the given element.

Parameter | Type | Description
--------- | ---- | -----------
xPath | string | A xPath string, describing the desired element.
element | Element | The desired element.
document | Document | The document to analyse, that contains the desired element.

*Returns:* True, if the xPath describes only the desired element.

## Example
Get a robust XPath from an absolute XPath:
```javascript
import { RobulaPlus } from "robula-plus";

let robulaPlus = new RobulaPlus();
let element = robulaPlus.getElementByXPath('/html/body/div/span/a', document);
robulaPlus.getRobustXPath(element, document);
```

## Contributing
A current version of Node.js and npm is recommended. To clone this repository, type:
```
git clone https://github.com/cyluxx/robula-plus.git
```
Navigate to the directory, and install dependencies:
```
cd robula-plus
npm install
```
Run tests with the following command:
```
npm test
```

## About
Authors: [Maurizio Leotta](https://www.disi.unige.it/person/LeottaM/), [Andrea Stocco](https://www.disi.unige.it/person/StoccoA/), [Filippo Ricca](https://www.disi.unige.it/person/RiccaF/) and [Paolo Tonella](https://www.inf.usi.ch/faculty/tonella/#/).

This TypeScript Implementation by: [@Cyluxx](https://github.com/cyluxx)

For more information on how the algorithm works, please refer to:

> [1] Maurizio Leotta, Andrea Stocco, Filippo Ricca, Paolo Tonella. ROBULA+: An Algorithm for Generating Robust XPath Locators for Web Testing. Journal of Software: Evolution and Process (JSEP), Volume 28, Issue 3, pp.177–204.John Wiley & Sons, 2016. https://doi.org/10.1002/smr.1771
