import { RobulaPlus, XPath } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfConvertStar: xPath not vaild', () => {
    let xPath: XPath = new XPath('foo');
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([]);
});

test('transfConvertStar: xPath does not start with "//*"', () => {
    let xPath: XPath = new XPath('/html/body/div/h1');
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([]);
});

test('transfConvertStar: xPath starts with "//*"', () => {
    let xPath: XPath = new XPath('//*');
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([{value: '//div'}]);
});

test('transfConvertStar: xPath starts with "//*" and has appendix', () => {
    let xPath: XPath = new XPath('//*/foo');
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([{value: '//div/foo'}]);
});