import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfConvertStar: xPath does not start with "//*"', () => {
  let xPath: XPath = new XPath('//div');
  let element: Element = document.createElement('div');
  expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([]);
});

test('transfConvertStar: xPath starts with "//*"', () => {
  let xPath: XPath = new XPath('//*');
  let element: Element = document.createElement('div');
  expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([{ value: '//div' }]);
});

test('transfConvertStar: xPath starts with "//*" and has appendix', () => {
  let xPath: XPath = new XPath('//*/span');
  let ancestor: Element = document.createElement('div');
  let element: Element = document.createElement('span');
  ancestor.appendChild(element);
  expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([{ value: '//div/span' }]);
});

test('transfConvertStar: xPath starts with "//*" and has attribute', () => {
  let xPath: XPath = new XPath('//*[foo]');
  let element: Element = document.createElement('div');
  expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([{ value: '//div[foo]' }]);
});
