import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('getRobustXPath: Document does not contain given element', () => {
  let doc: Document = document.implementation.createHTMLDocument('');
  let element: Element = doc.createElement('span');
  expect(() => robulaPlus.getRobustXPath(element, doc)).toThrow();
});

test('getRobustXPath: Document does contain given element', () => {
  let doc: Document = document.implementation.createHTMLDocument('');
  let element: Element = doc.body.appendChild(doc.createElement('span'));
  expect(robulaPlus.getRobustXPath(element, doc)).toEqual('//span');
});

test('getRobustXPath: Element is unique by tagName', () => {
  let doc: Document = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = `<head></head><body><h1>My First Heading</h1><p>My first paragraph.</p></body>`;
  let element: Element = doc.body.appendChild(doc.createElement('div'));
  expect(robulaPlus.getRobustXPath(element, doc)).toEqual('//div');
});

test('getRobustXPath: Element is unique by id', () => {
  let doc: Document = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = `<head></head><body><div id="bar"><div id="1"></div><div class="foo"></div></div><h1>My First Heading</h1><p>My first paragraph.</p></body>`;
  let element: Element = doc.body.appendChild(doc.createElement('div'));
  element.setAttribute('id', '42');
  expect(robulaPlus.getRobustXPath(element, doc)).toEqual("//*[@id='42']");
});

test('getRobustXPath: Element is unique by text', () => {
  let doc: Document = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = `<head></head><body><h1>Not this element</h1><h1>Not that element</h1><h1>This element</h1><h1>Not that element</h1></body>`;
  let element: Element = robulaPlus.getElementByXPath('/html/body/h1[3]', doc);
  expect(robulaPlus.getRobustXPath(element, doc)).toEqual("//*[contains(text(),'This element')]");
});

test('getRobustXPath: Element is unique by attribute', () => {
  let doc: Document = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = `<head></head><body><h1 class="false"></h1><h1 class="false"></h1><h1 class="true"></h1><h1 class="false"></h1></body>`;
  let element: Element = robulaPlus.getElementByXPath('/html/body/h1[3]', doc);
  expect(robulaPlus.getRobustXPath(element, doc)).toEqual("//*[@class='true']");
});

test('getRobustXPath: Element is unique by attribute set', () => {
  let doc: Document = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = `<head></head><body><h1 class="false" title="foo"></h1><h1 class="false" title="bar"></h1><h1 class="true" title="foo"></h1><h1 class="true" title="bar"></h1></body>`;
  let element: Element = robulaPlus.getElementByXPath('/html/body/h1[3]', doc);
  expect(robulaPlus.getRobustXPath(element, doc)).toEqual("//*[@class='true' and @title='foo']");
});

test('getRobustXPath: Element is unique by position', () => {
  let doc: Document = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = `<h1></h1><h1></h1><h1></h1><h1></h1>`;
  let element: Element = robulaPlus.getElementByXPath('/html/body/h1[3]', doc);
  expect(robulaPlus.getRobustXPath(element, doc)).toEqual('//*[3]');
});

test('getRobustXPath: Element is unique by level', () => {
  let doc: Document = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = `<head></head><body><h1></h1><h1></h1><div><h1></h1></div><h1></h1></body>`;
  let element: Element = robulaPlus.getElementByXPath('/html/body/div/h1', doc);
  expect(robulaPlus.getRobustXPath(element, doc)).toEqual('//div/*');
});
