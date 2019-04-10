import { XPath } from '../index';

test('headHasAnyPredicates: xPath has no predicate', () => {
  let xPath: XPath = new XPath('//div');
  expect(xPath.headHasAnyPredicates()).toBe(false);
});

test('headHasAnyPredicates: xPath has predicate', () => {
  let xPath: XPath = new XPath('//div[foo]');
  expect(xPath.headHasAnyPredicates()).toBe(true);
});

test('headHasPositionPredicate: xPath has no position predicate', () => {
  let xPath: XPath = new XPath('//div');
  expect(xPath.headHasAnyPredicates()).toBe(false);
});

test('headHasPositionPredicate: xPath has position predicate', () => {
  let xPath: XPath = new XPath('//div[2]');
  expect(xPath.headHasAnyPredicates()).toBe(true);
});

test('headHasTextPredicate: xPath has no predicate', () => {
  let xPath: XPath = new XPath('//div');
  expect(xPath.headHasAnyPredicates()).toBe(false);
});

test('headHasTextPredicate: xPath has predicate', () => {
  let xPath: XPath = new XPath('//div[text()="foo"]');
  expect(xPath.headHasAnyPredicates()).toBe(true);
});

test('addPredicateToHead: xPath has length 2', () => {
  let xPath: XPath = new XPath('//foo/bar');
  xPath.addPredicateToHead('[predicate]');
  expect(xPath.getValue()).toEqual('//foo[predicate]/bar');
});

test('addPredicateToHead: xPath has length 1', () => {
  let xPath: XPath = new XPath('//foo');
  xPath.addPredicateToHead('[predicate]');
  expect(xPath.getValue()).toEqual('//foo[predicate]');
});

test('getLength: xPath has length 0', () => {
  let xPath: XPath = new XPath('//');
  expect(xPath.getLength()).toEqual(0);
});

test('getLength: xPath has length 1', () => {
  let xPath: XPath = new XPath('//*');
  expect(xPath.getLength()).toEqual(1);
});

test('getLength: xPath has length 2', () => {
  let xPath: XPath = new XPath('//*/*');
  expect(xPath.getLength()).toEqual(2);
});
