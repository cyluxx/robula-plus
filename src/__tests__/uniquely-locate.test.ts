import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('uniquelyLocate: xPath does not describe an element inside the document', () => {
  let doc: Document = document.implementation.createHTMLDocument('');
  let element: Element = doc.body.appendChild(document.createElement('div'));
  let xPath: string = '/html/body/span';
  expect(robulaPlus.uniquelyLocate(xPath, element, doc)).toBe(false);
});

test('uniquelyLocate: xPath describes only one element inside the document', () => {
  let doc: Document = document.implementation.createHTMLDocument('');
  let element: Element = doc.body.appendChild(document.createElement('span'));
  let xPath: string = '/html/body/span';
  expect(robulaPlus.uniquelyLocate(xPath, element, doc)).toBe(true);
});

test('uniquelyLocate: xPath describes two elements inside the document', () => {
  let doc: Document = document.implementation.createHTMLDocument('');
  doc.body.appendChild(document.createElement('span'));
  let element: Element = doc.body.appendChild(document.createElement('span'));
  let xPath: string = '/html/body/span';
  expect(robulaPlus.uniquelyLocate(xPath, element, doc)).toBe(false);
});
