import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('getRobustXPath: Document does not contain given element', () => {
    let doc: Document = document.implementation.createHTMLDocument('');
    let element: Element = document.createElement('span');   
    expect(robulaPlus.getRobustXPath(element, doc)).toThrowError(/^Document does not contain given element!$/);
});

test('getRobustXPath: Document does contain given element', () => {
    let doc: Document = document.implementation.createHTMLDocument('');
    let element: Element = doc.body.appendChild(document.createElement('span'));   
    expect(robulaPlus.getRobustXPath(element, doc)).toEqual([]);
});