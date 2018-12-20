import { RobulaPlus } from '../index';

const robulaPlus: RobulaPlus = new RobulaPlus();

test('transfAddPosistion: xPath head has position predicate', () => {
    let xPath: string = '//span[42]';
    let parentElement: Element = document.createElement('div');
    parentElement.innerHTML = '<span></span><span></span>';
    let element: Element = parentElement.firstElementChild!;
    expect(robulaPlus.transfAddPosition(xPath, element)).toEqual([]);
});

test('transfAddPosistion: Element has no siblings', () => {
    let xPath: string = '//span';
    let parentElement: Element = document.createElement('div');
    parentElement.innerHTML = '<span></span>';
    let element: Element = parentElement.firstElementChild!;
    expect(robulaPlus.transfAddPosition(xPath, element)).toEqual(['//span[0]']);
});

test('transfAddPosistion: Element has only siblings with different tagNames. Element is at last position', () => {
    let xPath: string = '//span';
    let parentElement: Element = document.createElement('div');
    parentElement.innerHTML = '<a></a><span></span>';
    let element: Element = parentElement.lastElementChild!;
    expect(robulaPlus.transfAddPosition(xPath, element)).toEqual(['//span[0]']);
});

test('transfAddPosistion: Element has only siblings with different tagNames. Element is at last position. xPath contains *', () => {
    let xPath: string = '//*';
    let parentElement: Element = document.createElement('div');
    parentElement.innerHTML = '<a></a><span></span>';
    let element: Element = parentElement.lastElementChild!;
    expect(robulaPlus.transfAddPosition(xPath, element)).toEqual(['//*[1]']);
});

test('transfAddPosistion: Element is at position 0', () => {
    let xPath: string = '//span';
    let parentElement: Element = document.createElement('div');
    parentElement.innerHTML = '<span></span><span></span>';
    let element: Element = parentElement.firstElementChild!;
    expect(robulaPlus.transfAddPosition(xPath, element)).toEqual(['//span[0]']);
});

test('transfAddPosistion: Element is at last position', () => {
    let xPath: string = '//span';
    let parentElement: Element = document.createElement('div');
    parentElement.innerHTML = '<span></span><span></span>';
    let element: Element = parentElement.lastElementChild!;
    expect(robulaPlus.transfAddPosition(xPath, element)).toEqual(['//span[1]']);
});