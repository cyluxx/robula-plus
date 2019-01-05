/**
* Maurizio Leotta, Andrea Stocco, Filippo Ricca, Paolo Tonella. ROBULA+:
* An Algorithm for Generating Robust XPath Locators for Web Testing. Journal
* of Software: Evolution and Process (JSEP), Volume 28, Issue 3, pp.177–204.
* John Wiley & Sons, 2016. 
* https://doi.org/10.1002/smr.1771
*/

export class RobulaPlus {

    /**
     * Main class, containing the Algorithm.
     * 
     * @param options - (optional) algorithm options.
     */
    constructor(options?: RobulaPlusOptions) {

    }

    /** 
    * Returns a optimized robust XPath locator string.
    * 
    * @param element - The desired element.
    * @param document - The document to analyse, that contains the desired element.
    *
    * @returns - A robust xPath locator string, describing the desired element.
    */
    public getRobustXPath(element: Element, document: Document): string {
        if (!document.body.contains(element)) {
            throw new Error('Document does not contain given element!');
        }
        let xPathList: XPath[] = [new XPath('//*')];
        while (xPathList.length > 0) {
            let xPath: XPath = xPathList.shift()!;
            let temp: XPath[] = [];
            temp = temp.concat(this.transfConvertStar(xPath, element));
            temp = temp.concat(this.transfAddId(xPath, element));
            temp = temp.concat(this.transfAddText(xPath, element));
            temp = temp.concat(this.transfAddAttribute(xPath, element));
            temp = temp.concat(this.transfAddAttributeSet(xPath, element));
            temp = temp.concat(this.transfAddPosition(xPath, element));
            temp = temp.concat(this.transfAddLevel(xPath, element));
            temp = [...new Set(temp)]; //removes duplicates
            for (let x of temp) {
                if (this.uniquelyLocate(x.getValue(), element, document)) {
                    return x.getValue();
                }
                xPathList.push(x);
            }
        }
        throw new Error('Internal Error: xPathList.shift returns undefined');
    }

    /** 
    * Returns an element in the given document located by the given xPath locator.
    * 
    * @param xPath - A xPath string, describing the desired element.
    * @param document - The document to analyse, that contains the desired element.
    *
    * @returns - The first maching Element located.
    */
    public getElementByXPath(xPath: string, document: Document): Element {
        return document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as Element;
    }

    /** 
    * Returns, wheater an xPath describes only the given element.
    * 
    * @param xPath - A xPath string, describing the desired element.
    * @param element - The desired element.
    * @param document - The document to analyse, that contains the desired element.
    *
    * @returns - True, if the xPath describes only the desired element.
    */
    public uniquelyLocate(xPath: string, element: Element, document: Document): boolean {
        let nodesSnapshot: XPathResult = document.evaluate(xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return nodesSnapshot.snapshotLength === 1 && nodesSnapshot.snapshotItem(0) === element;
    }

    public transfConvertStar(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        let ancestor: Element = this.getAncestor(element, xPath.getLength() - 1);
        if (xPath.startsWith("//*")) {
            output.push(new XPath("//" + ancestor.tagName.toLowerCase() + xPath.substring(3)));
        }
        return output;
    };

    public transfAddId(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        let ancestor: Element = this.getAncestor(element, xPath.getLength() - 1);
        if (ancestor.id && !xPath.headHasAnyPredicates()) {
            let newXPath: XPath = new XPath(xPath.getValue());
            newXPath.addPredicateToHead(`[@id='${ancestor.id}']`)
            output.push(newXPath);
        }
        return output;
    }

    public transfAddText(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        let ancestor: Element = this.getAncestor(element, xPath.getLength() - 1);
        if (ancestor.textContent && !xPath.headHasPositionPredicate() && !xPath.headHasTextPredicate()) {
            let newXPath: XPath = new XPath(xPath.getValue());
            newXPath.addPredicateToHead(`[contains(text(),'${ancestor.textContent}')]`)
            output.push(newXPath);
        }
        return output;
    }

    public transfAddAttribute(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        let ancestor: Element = this.getAncestor(element, xPath.getLength() - 1);
        if (!xPath.headHasAnyPredicates()) {
            for (let attribute of ancestor.attributes) {
                let newXPath: XPath = new XPath(xPath.getValue());
                newXPath.addPredicateToHead(`[@${attribute.name}='${attribute.value}']`)
                output.push(newXPath);
            }
        }
        return output;
    }

    public transfAddAttributeSet(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        let ancestor: Element = this.getAncestor(element, xPath.getLength() - 1);
        if (ancestor.attributes.length > 0 && !xPath.headHasAnyPredicates()) {
            let predicate: string = `[@${ancestor.attributes[0].name}='${ancestor.attributes[0].value}'`;
            for (let i: number = 1; i < ancestor.attributes.length; i++) {
                predicate += ` and @${ancestor.attributes[i].name}='${ancestor.attributes[i].value}'`;
            }
            predicate += ']';
            let newXPath: XPath = new XPath(xPath.getValue());
            newXPath.addPredicateToHead(predicate);
            output.push(newXPath);
        }
        return output;
    }

    public transfAddPosition(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        let ancestor: Element = this.getAncestor(element, xPath.getLength() - 1);
        if (!xPath.headHasPositionPredicate()) {
            let position: number = 1;
            if (xPath.startsWith("//*")) {
                position = Array.from(ancestor.parentNode!.children).indexOf(ancestor) + 1;
            }
            else {
                for (let child of ancestor.parentNode!.children) {
                    if (ancestor === child) {
                        break;
                    }
                    if (ancestor.tagName === child.tagName) {
                        position++;
                    }
                }
            }
            let newXPath: XPath = new XPath(xPath.getValue());
            newXPath.addPredicateToHead(`[${position}]`);
            output.push(newXPath);
        }
        return output;
    }

    public transfAddLevel(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        if (xPath.getLength() - 1 < this.getAncestorCount(element)) {
            output.push(new XPath('//*' + xPath.substring(1)));
        }
        return output;
    }

    private getAncestor(element: Element, index: number): Element {
        let output: Element = element;
        for (let i: number = 0; i < index; i++) {
            output = output.parentElement as Element;
        }
        return output;
    }

    private getAncestorCount(element: Element): number {
        let count: number = 0;
        while (element.parentElement) {
            element = element.parentElement;
            count++;
        }
        return count;
    }
}

export class XPath {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }

    public startsWith(string: string): boolean {
        return this.value.startsWith(string);
    }

    public substring(number: number): string {
        return this.value.substring(number);
    }

    public headHasAnyPredicates(): boolean {
        return this.value.split('/')[2].includes('[');
    }

    public headHasPositionPredicate(): boolean {
        let splitXPath: string[] = this.value.split('/');
        let regExp: RegExp = new RegExp('[[0-9]]');
        return splitXPath[2].includes('position()') || splitXPath[2].includes('last()') || regExp.test(splitXPath[2]);
    }

    public headHasTextPredicate(): boolean {
        return this.value.split('/')[2].includes('text()');
    }

    public addPredicateToHead(predicate: string): void {
        let splitXPath: string[] = this.value.split('/');
        splitXPath[2] += predicate;
        this.value = splitXPath.join('/');
    }

    public getLength(): number {
        let splitXPath: string[] = this.value.split('/');
        let length: number = 0;
        for (let piece of splitXPath) {
            if (piece) {
                length++;
            }
        }
        return length;
    }
}

export class RobulaPlusOptions {

}
