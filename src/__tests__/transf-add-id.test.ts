import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddId: xPath head has already a predicate', () => {
    let xPath: string = '//div[bar]/foo';
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfAddId(xPath, element)).toEqual([]);
});

test('transfAddId: Element div has id, xPath head has already a predicate', () => {
    let xPath = '//div[bar]/span';
    let element: Element = document.createElement('div');
    element.setAttribute('id', 'foo');
    expect(robulaPlus.transfAddId(xPath, element)).toEqual([]);
});

test('transfAddId: Element div has id', () => {
    let xPath: string = '//div/span';
    let element: Element = document.createElement('div');
    element.innerHTML = '<span></span>';
    element.setAttribute('id', 'foo');
    expect(robulaPlus.transfAddId(xPath, element)).toEqual(["//div[@id='foo']/span"]);
});