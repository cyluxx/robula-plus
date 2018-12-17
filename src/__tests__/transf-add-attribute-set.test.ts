import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddAttributeSet: xPath head has already a predicate', () => {
    let xPath: string = '//div[bar]';
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([]);
});

test('transfAddAttributeSet: Element has 2 attributes and appendix, xPath head has already a predicate', () => {
    let xPath = '//div[bar]/span';
    let element: Element = document.createElement('div');
    element.setAttribute('class', 'foo');
    element.setAttribute('id', 'bar');
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([]);
});

test('transfAddAttributeSet: Element has 1 Attribute and appendix', () => {
    let xPath: string = '//div/span';
    let element: Element = document.createElement('div');
    element.innerHTML = '<span></span>';
    element.setAttribute('class', 'foo');
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual(["//div[@class='foo']/span"]);
});

test('transfAddAttributeSet: Element has 2 Attributes and appendix', () => {
    let xPath: string = '//div/span';
    let element: Element = document.createElement('div');
    element.innerHTML = '<span></span>';
    element.setAttribute('class', 'foo');
    element.setAttribute('id', 'bar');
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual(["//div[@class='foo' and @id='bar']/span"]);
});

test('transfAddAttributeSet: Element has no Attributes', () => {
    let xPath: string = '//div';
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfAddAttributeSet(xPath, element)).toEqual([]);
});