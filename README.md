# Robula+
Robula+ is an algorithm to generate robust XPath-based locators, that are likely to work correctly with new releases of a web application. Robula+ reduces the locators' fragility on average by 90% w.r.t. absolute locators and by 63% w.r.t. Selenium IDE locators [[1]](#about).

[![Build Status](https://travis-ci.org/cyluxx/robula-plus.svg?branch=master)](https://travis-ci.org/cyluxx/robula-plus)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/cyluxx/robula-plus/master.svg)](https://codecov.io/gh/cyluxx/robula-plus/)

## Usage
The code mainly contains of the three following Methods:

### getRobustXPath(element, document):
Returns an optimized robust XPath locator string, describing a desired element.

Parameter | Type | Description
--------- | ---- | -----------
element | Element | The desired element.
document | Document | The document to analyse, that contains the desired element.

### getElementByXPath(xPath, document):
Returns the first element in the given document located by the given xPath locator.

Parameter | Type | Description
--------- | ---- | -----------
xPath | string | A xPath string, describing the desired element.
document | Document | The document to analyse, that contains the desired element.

### uniquelyLocate(xPath, element, document):
Returns _true_, if the xPath describes only the desired element.

Parameter | Type | Description
--------- | ---- | -----------
xPath | string | A xPath string, describing the desired element.
element | Element | The desired element.
document | Document | The document to analyse, that contains the desired element.

## Example
Get a robust XPath from an absolute XPath:
```javascript
import { RobulaPlus } from "robula-plus";

let robulaPlus = new RobulaPlus();
let element = robulaPlus.getElementByXPath('/html/body/div/span/a', document);
robulaPlus.getRobustXPath(element, document);
```

## Installation
__Note:__ The License of this code needs some clarification, so until then there will be no public install package available. If you want to use the code, you have to clone and build it manually, as described in the steps below:

1. Download a current version of [Node.js](https://nodejs.org). 
2. To clone this repository, type:
```
git clone https://github.com/cyluxx/robula-plus.git
```
3. Navigate to the directory, and install dependencies:
```
cd robula-plus
npm install
```
4. To build the code, run:
```
npm run build
```
You now should have a _lib_ folder, that you can include in your private JavaScript / TypeScript project.

## About
Authors: [Maurizio Leotta](https://www.disi.unige.it/person/LeottaM/), [Andrea Stocco](https://www.disi.unige.it/person/StoccoA/), [Filippo Ricca](https://www.disi.unige.it/person/RiccaF/) and [Paolo Tonella](https://www.inf.usi.ch/faculty/tonella/#/).

This TypeScript Implementation by: [@Cyluxx](https://github.com/cyluxx)

For more information on how the algorithm works, please refer to:

> [1] Maurizio Leotta, Andrea Stocco, Filippo Ricca, Paolo Tonella. ROBULA+: An Algorithm for Generating Robust XPath Locators for Web Testing. Journal of Software: Evolution and Process (JSEP), Volume 28, Issue 3, pp.177–204.John Wiley & Sons, 2016. https://doi.org/10.1002/smr.1771
