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
    constructor(options?: RobulaPlusOptions){

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
        let xPathList: XPath[] = [new XPath('//*')];
        while (true) {
            let xPath: XPath = xPathList.shift()!;
            let temp: XPath[] = [];
            temp.concat(this.transfConvertStar(xPath, element));
            temp.concat(this.transfAddId(xPath, element));
            temp.concat(this.transfAddText(xPath, element));
            temp.concat(this.transfAddAttribute(xPath, element));
            temp.concat(this.transfAddAttributeSet(xPath, element));
            temp.concat(this.transfAddPosition(xPath, element));
            temp.concat(this.transfAddLevel(xPath, element));
            for (let x of temp) {
                if(this.uniquelyLocate(x.getValue(), element, document)){
                    return x.getValue();
                }
                xPathList.push(x);
            }
        }
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
        let iterator: XPathResult = document.evaluate(xPath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        let thisNode: Element = iterator.iterateNext() as Element;
        return thisNode === element && !iterator.iterateNext();
    }

    public transfConvertStar(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        if (xPath.startsWith("//*")) {
            output.push(new XPath ("//" + element.tagName.toLowerCase() + xPath.substring(3)));
        }
        return output;
    };

    public transfAddId(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        if (element.id && !xPath.headHasAnyPredicates()) {
            output.push(new XPath(xPath.addPredicateToHead(`[@id='${element.id}']`)));
        }
        return output;
    }

    public transfAddText(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        if (element.textContent && !xPath.headHasPositionPredicate() && !xPath.headHasTextPredicate()) {
            output.push(new XPath(xPath.addPredicateToHead(`[contains(text(),'${element.textContent}')]`)));
        }
        return output;
    }

    public transfAddAttribute(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        if (!xPath.headHasAnyPredicates()) {
            for (let attribute of element.attributes) {
                output.push(new XPath(xPath.addPredicateToHead(`[@${attribute.name}='${attribute.value}']`)));
            }
        }
        return output;
    }

    public transfAddAttributeSet(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        if (element.attributes.length > 0 && !xPath.headHasAnyPredicates()) {
            let predicate: string = `[@${element.attributes[0].name}='${element.attributes[0].value}'`;
            for (let i: number = 1; i < element.attributes.length; i++) {
                predicate += ` and @${element.attributes[i].name}='${element.attributes[i].value}'`;
            }
            predicate += ']';
            output.push(new XPath(xPath.addPredicateToHead(predicate)));
        }
        return output;
    }

    public transfAddPosition(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        if (!xPath.headHasPositionPredicate()) {
            let position: number = 0;
            if (xPath.startsWith("//*")) {
                position = Array.from(element.parentNode!.children).indexOf(element);
            }
            else {
                for (let child of element.parentNode!.children) {
                    if (element === child) {
                        break;
                    }
                    if (element.tagName === child.tagName) {
                        position++;
                    }
                }
            }
            output.push(new XPath(xPath.addPredicateToHead(`[${position}]`)));
        }
        return output;
    }

    public transfAddLevel(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        if (xPath.getLength() < this.getAncestorCount(element) + 1) {
            output.push(new XPath('//*' + xPath.substring(1)));
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
    
    constructor(value: string){
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
    
    public addPredicateToHead(predicate: string): string {
        let splitXPath: string[] = this.value.split('/');
        splitXPath[2] += predicate;
        return splitXPath.join('/');
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
