import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddText: xPath head has text predicate', () => {
    let xPath: string = '//div[contains(text(),"foo")]';
    let element: Element = document.createElement('div');
    element.textContent = 'foo';
    expect(robulaPlus.transfAddText(xPath, element)).toEqual([]);
});

test('transfAddText: xPath head has position predicate', () => {
    let xPath = '//div[position()=1]';
    let element: Element = document.createElement('div');
    element.innerHTML = '<span></span>';
    expect(robulaPlus.transfAddText(xPath, element)).toEqual([]);
});

test('transfAddText: Element has text', () => {
    let xPath: string = '//div';
    let element: Element = document.createElement('div');
    element.textContent = 'foo';
    expect(robulaPlus.transfAddText(xPath, element)).toEqual(["//div[contains(text(),'foo')]"]);
});