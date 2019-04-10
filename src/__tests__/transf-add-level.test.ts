import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddLevel: xPath.length (N) is bigger than Ancestors.length (L)', () => {
  let xPath: XPath = new XPath('//div/div');
  let element: Element = document.createElement('div');
  expect(robulaPlus.transfAddLevel(xPath, element)).toEqual([]);
});

test('transfAddLevel: xPath.length (N) is equal to Ancestors.length (L)', () => {
  let xPath: XPath = new XPath('//div/div');
  let parentElement: Element = document.createElement('div');
  parentElement.innerHTML = '<div></div>';
  expect(robulaPlus.transfAddLevel(xPath, parentElement.firstElementChild!)).toEqual([]);
});

test('transfAddLevel: xPath.length (N) is smaller than Ancestors.length (L)', () => {
  let xPath: XPath = new XPath('//div/div');
  let parentParentElement: Element = document.createElement('div');
  parentParentElement.innerHTML = '<div><div></div></div>';
  expect(robulaPlus.transfAddLevel(xPath, parentParentElement.firstElementChild!.firstElementChild!)).toEqual([
    { value: '//*/div/div' },
  ]);
});
