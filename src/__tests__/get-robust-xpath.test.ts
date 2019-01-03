import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('getRobustXPath: Document does not contain given element', () => {
    let doc: Document = document.implementation.createHTMLDocument('');
    let element: Element = document.createElement('span');   
    expect(() => robulaPlus.getRobustXPath(element, doc)).toThrow();
});

test('getRobustXPath: Document does contain given element', () => {
    let doc: Document = document.implementation.createHTMLDocument('');
    let element: Element = doc.body.appendChild(document.createElement('span'));   
    expect(robulaPlus.getRobustXPath(element, doc)).toEqual('//span');
});

test('getRobustXPath: Get Robust xPath 1', () => {
    let doc: Document = document.implementation.createHTMLDocument(
        `<!DOCTYPE html>
        <html>
        <body>
        
        <h1>My First Heading</h1>
        
        <p>My first paragraph.</p>
        
        </body>
        </html>`
    );
    let element: Element = doc.body.appendChild(document.createElement('div'));
    expect(robulaPlus.getRobustXPath(element, doc)).toEqual('//div');
});

test('getRobustXPath: Get Robust xPath 2', () => {
    let doc: Document = document.implementation.createHTMLDocument(
        `<!DOCTYPE html>
        <html>
        <body>

        <div id="bar">
        <div id="1"></div>
        <div class="foo"></div>
        </div>

        <h1>My First Heading</h1>
        
        <p>My first paragraph.</p>
        
        </body>
        </html>`
    );
    let element: Element = doc.body.appendChild(document.createElement('div'));
    element.setAttribute('id', '42');
    expect(robulaPlus.getRobustXPath(element, doc)).toEqual('//div[42]');
});