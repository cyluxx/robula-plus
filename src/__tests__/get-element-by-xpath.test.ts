import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('getElementByXPath: Document does not contain Element described by xPath ', () => {
  let doc: Document = document.implementation.createHTMLDocument('<div></div>');
  let xPath: string = '/div/span';
  expect(robulaPlus.getElementByXPath(xPath, doc)).toEqual(null);
});

test('getElementByXPath: Document contains Element described by xPath ', () => {
  let doc: Document = document.implementation.createHTMLDocument('');
  let element: Element = doc.body.appendChild(document.createElement('span'));
  let xPath: string = '/html/body/span';
  expect(robulaPlus.getElementByXPath(xPath, doc)).toEqual(element);
});
