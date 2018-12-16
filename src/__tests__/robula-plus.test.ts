import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfConvertStar: xp not vaild', () => {
    let xp: string = 'foo';
    let tag: string = 'tag';
    expect(robulaPlus.transfConvertStar(xp, tag)).toEqual([]);
});

test('transfConvertStar: precondition (xPath starts with "//*") not fulfilled', () => {
    let xp: string = '/html/body/div/h1';
    let tag: string = 'tag';
    expect(robulaPlus.transfConvertStar(xp, tag)).toEqual([]);
});

test('transfConvertStar: xp starts with "//*"', () => {
    let xp: string = '//*';
    let tag: string = 'tag';
    expect(robulaPlus.transfConvertStar(xp, tag)).toEqual(['//' + tag]);
});

test('transfConvertStar: xp starts with "//*" and has appendix', () => {
    let xp: string = '//*/foo';
    let tag: string = 'tag';
    expect(robulaPlus.transfConvertStar(xp, tag)).toEqual(['//' + tag + '/foo']);
});

test('transfAddAttribute: The nth level of xPath should not contain any kind of predicates', () => {
    let xp: string = '//*[bar]/foo';
    let element: Element = document.createElement('div');
    expect(robulaPlus.transfAddAttribute(xp, element)).toEqual([]);

    xp = '//foo[bar]/foo';
    expect(robulaPlus.transfAddAttribute(xp, element)).toEqual([]);
});

