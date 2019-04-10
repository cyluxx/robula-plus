import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddText: xPath head has text predicate', () => {
  let xPath: XPath = new XPath('//div[contains(text(),"foo")]');
  let element: Element = document.createElement('div');
  element.textContent = 'foo';
  expect(robulaPlus.transfAddText(xPath, element)).toEqual([]);
});

test('transfAddText: xPath head has position predicate', () => {
  let xPath: XPath = new XPath('//div[position()=1]');
  let element: Element = document.createElement('div');
  element.innerHTML = '<span></span>';
  expect(robulaPlus.transfAddText(xPath, element)).toEqual([]);
});

test('transfAddText: Element has text', () => {
  let xPath: XPath = new XPath('//div');
  let element: Element = document.createElement('div');
  element.textContent = 'foo';
  expect(robulaPlus.transfAddText(xPath, element)).toEqual([{ value: "//div[contains(text(),'foo')]" }]);
});
