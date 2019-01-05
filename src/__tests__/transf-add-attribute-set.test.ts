import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddAttributeSet: xPath head has already a predicate', () => {
    let xPath: XPath = new XPath('//div[bar]');
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([]);
});

test('transfAddAttributeSet: Element has 2 attributes and appendix, xPath head has already a predicate', () => {
    let xPath: XPath = new XPath('//div[bar]/span');
    let ancestor: Element = document.createElement('div');
    let element: Element = document.createElement('span');
    ancestor.setAttribute('class', 'foo');
    ancestor.setAttribute('id', 'bar');
    ancestor.appendChild(element);
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([]);
});

test('transfAddAttributeSet: Element has 1 Attribute and appendix', () => {
    let xPath: XPath = new XPath('//div/span');
    let ancestor: Element = document.createElement('div');
    let element: Element = document.createElement('span');
    ancestor.setAttribute('class', 'foo');
    ancestor.appendChild(element);
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([{value: "//div[@class='foo']/span"}]);
});

test('transfAddAttributeSet: Element has 2 Attributes and appendix', () => {
    let xPath: XPath = new XPath('//div/span');
    let ancestor: Element = document.createElement('div');
    let element: Element = document.createElement('span');
    ancestor.setAttribute('class', 'foo');
    ancestor.setAttribute('id', 'bar');
    ancestor.appendChild(element);
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([{value: "//div[@class='foo' and @id='bar']/span"}]);
});

test('transfAddAttributeSet: Element has 3 Attributes and appendix', () => {
    let xPath: XPath = new XPath('//div/span');
    let ancestor: Element = document.createElement('div');
    let element: Element = document.createElement('span');
    ancestor.setAttribute('class', 'foo');
    ancestor.setAttribute('id', 'bar');
    ancestor.setAttribute('title', 'title');
    ancestor.appendChild(element);
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([{value: "//div[@class='foo' and @id='bar' and @title='title']/span"}]);
});

test('transfAddAttributeSet: Element has no Attributes', () => {
    let xPath: XPath = new XPath('//div');
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([]);
});