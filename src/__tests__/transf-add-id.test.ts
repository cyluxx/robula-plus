import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddId: xPath head has already a predicate', () => {
  let xPath: XPath = new XPath('//div[bar]/span');
  let ancestor: Element = document.createElement('div');
  let element: Element = document.createElement('span');
  ancestor.appendChild(element);
  ancestor.setAttribute('id', 'foo');
  expect(robulaPlus.transfAddId(xPath, element)).toEqual([]);
});

test('transfAddId: Ancestor element div has id, xPath head has already some predicate', () => {
  let xPath: XPath = new XPath('//div[bar]/span');
  let ancestor: Element = document.createElement('div');
  let element: Element = document.createElement('span');
  ancestor.appendChild(element);
  ancestor.setAttribute('id', 'foo');
  expect(robulaPlus.transfAddId(xPath, element)).toEqual([]);
});

test('transfAddId: Ancestor element div has id', () => {
  let xPath: XPath = new XPath('//div/span');
  let ancestor: Element = document.createElement('div');
  let element: Element = document.createElement('span');
  ancestor.appendChild(element);
  ancestor.setAttribute('id', 'foo');
  expect(robulaPlus.transfAddId(xPath, element)).toEqual([{ value: "//div[@id='foo']/span" }]);
});
