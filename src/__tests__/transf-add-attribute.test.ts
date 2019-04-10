import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddAttribute: xPath head has already a predicate', () => {
  let xPath: XPath = new XPath('//div[bar]');
  let element: Element = document.createElement('div');
  expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([]);
});

test('transfAddAttribute: Element has 2 attributes and appendix, xPath head has already a predicate', () => {
  let xPath: XPath = new XPath('//div[bar]/span');
  let ancestor: Element = document.createElement('div');
  let element: Element = document.createElement('span');
  ancestor.setAttribute('class', 'foo');
  ancestor.setAttribute('id', 'bar');
  ancestor.appendChild(element);
  expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([]);
});

test('transfAddAttribute: Element has 1 Attribute and appendix', () => {
  let xPath: XPath = new XPath('//div/span');
  let ancestor: Element = document.createElement('div');
  let element: Element = document.createElement('span');
  ancestor.setAttribute('class', 'foo');
  ancestor.appendChild(element);
  expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([{ value: "//div[@class='foo']/span" }]);
});

test('transfAddAttribute: Element has 2 Attributes and appendix', () => {
  let xPath: XPath = new XPath('//div/span');
  let ancestor: Element = document.createElement('div');
  let element: Element = document.createElement('span');
  ancestor.setAttribute('class', 'foo');
  ancestor.setAttribute('id', 'bar');
  ancestor.appendChild(element);
  expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([
    { value: "//div[@class='foo']/span" },
    { value: "//div[@id='bar']/span" },
  ]);
});

test('transfAddAttribute: Element has no Attributes', () => {
  let xPath: XPath = new XPath('//div');
  let element: Element = document.createElement('div');
  expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([]);
});

test('transfAddAttribute: Element has one default black list attribute', () => {
  let xPath: XPath = new XPath('//div');
  let element: Element = document.createElement('div');
  element.setAttribute('href', 'foo');
  expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([]);
});

test('transfAddAttribute: Element has two priorization list attributes', () => {
  let xPath: XPath = new XPath('//div');
  let element: Element = document.createElement('div');
  element.setAttribute('class', 'foo');
  element.setAttribute('name', 'bar');
  expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([
    { value: "//div[@name='bar']" },
    { value: "//div[@class='foo']" },
  ]);
});

test('transfAddAttribute: Element has one priorization list attribute and one normal attribute', () => {
  let xPath: XPath = new XPath('//div');
  let element: Element = document.createElement('div');
  element.setAttribute('lang', 'foo');
  element.setAttribute('name', 'bar');
  expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([
    { value: "//div[@name='bar']" },
    { value: "//div[@lang='foo']" },
  ]);
});
