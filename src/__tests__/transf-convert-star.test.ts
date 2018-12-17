import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfConvertStar: xPath not vaild', () => {
    let xPath: string = 'foo';
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([]);
});

test('transfConvertStar: xPath does not start with "//*"', () => {
    let xPath: string = '/html/body/div/h1';
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfConvertStar(xPath, element)).toEqual([]);
});

test('transfConvertStar: xPath starts with "//*"', () => {
    let xPath: string = '//*';
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfConvertStar(xPath, element)).toEqual(['//div']);
});

test('transfConvertStar: xPath starts with "//*" and has appendix', () => {
    let xPath: string = '//*/foo';
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfConvertStar(xPath, element)).toEqual(['//div/foo']);
});