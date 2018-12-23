import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddAttribute: xPath head has already a predicate', () => {
    let xPath: XPath = new XPath('//div[bar]');
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([]);
});

test('transfAddAttribute: Element has 2 attributes and appendix, xPath head has already a predicate', () => {
    let xPath: XPath = new XPath('//div[bar]/span');
    let element: Element = document.createElement('div');
    element.setAttribute('class', 'foo');
    element.setAttribute('id', 'bar');
    expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([]);
});

test('transfAddAttribute: Element has 1 Attribute and appendix', () => {
    let xPath: XPath = new XPath('//div/span');
    let element: Element = document.createElement('div');
    element.innerHTML = '<span></span>';
    element.setAttribute('class', 'foo');
    expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([{value: "//div[@class='foo']/span"}]);
});

test('transfAddAttribute: Element has 2 Attributes and appendix', () => {
    let xPath: XPath = new XPath('//div/span');
    let element: Element = document.createElement('div');
    element.innerHTML = '<span></span>';
    element.setAttribute('class', 'foo');
    element.setAttribute('id', 'bar');
    expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([{value: "//div[@class='foo']/span"}, {value: "//div[@id='bar']/span"}]);
});

test('transfAddAttribute: Element has no Attributes', () => {
    let xPath: XPath = new XPath('//div');
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfAddAttribute(xPath, element)).toEqual([]);
});