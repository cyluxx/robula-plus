/**
* Maurizio Leotta, Andrea Stocco, Filippo Ricca, Paolo Tonella. ROBULA+:
* An Algorithm for Generating Robust XPath Locators for Web Testing. Journal
* of Software: Evolution and Process (JSEP), Volume 28, Issue 3, pp.177–204.
* John Wiley & Sons, 2016. 
* https://doi.org/10.1002/smr.1771
*/

export class RobulaPlus {

    /** 
    * Returns a optimized robust XPath locator string.
    * 
    * @param element - The desired element.
    * @param document - The document to analyse, that contains the desired element.
    * @param options - (optional) algorithm options.
    *
    * @returns - A robust xPath locator string, describing the desired element.
    */
    public getRobustXPath(element: Element, document: Document, options?: RobulaPlusOptions): string {
        let xPathList: string[] = ['//*'];
        while (true) {
            let xPath: string = xPathList.shift()!;
            let temp: string[] = [];
            temp.concat(this.transfConvertStar(xPath, element));
            temp.concat(this.transfAddId(xPath, element));
            temp.concat(this.transfAddText(xPath, element));
            temp.concat(this.transfAddAttribute(xPath, element));
            temp.concat(this.transfAddAttributeSet(xPath, element));
            temp.concat(this.transfAddPosition(xPath, element));
            temp.concat(this.transfAddLevel(xPath, element));
            for (let x of temp) {
                if(this.uniquelyLocate(x, element, document)){
                    return x;
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
    * Returns, wheater xPath describes only the given element.
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

    public transfConvertStar(xPath: string, element: Element): string[] {
        let output: string[] = [];
        if (xPath.startsWith("//*")) {
            output.push("//" + element.tagName.toLowerCase() + xPath.substring(3));
        }
        return output;
    };

    public transfAddId(xPath: string, element: Element): string[] {
        let output: string[] = [];
        if (element.id && !this.headHasAnyPredicates(xPath)) {
            output.push(this.addPredicateToHead(xPath, `[@id='${element.id}']`));
        }
        return output;
    }

    public transfAddText(xPath: string, element: Element): string[] {
        let output: string[] = [];
        if (element.textContent && !this.headHasPositionPredicate(xPath) && !this.headHasTextPredicate(xPath)) {
            output.push(this.addPredicateToHead(xPath, `[contains(text(),'${element.textContent}')]`));
        }
        return output;
    }

    public transfAddAttribute(xPath: string, element: Element): string[] {
        let output: string[] = [];
        if (!this.headHasAnyPredicates(xPath)) {
            for (let attribute of element.attributes) {
                output.push(this.addPredicateToHead(xPath, `[@${attribute.name}='${attribute.value}']`));
            }
        }
        return output;
    }

    public transfAddAttributeSet(xPath: string, element: Element): string[] {
        let output: string[] = [];
        if (element.attributes.length > 0 && !this.headHasAnyPredicates(xPath)) {
            let predicate: string = `[@${element.attributes[0].name}='${element.attributes[0].value}'`;
            for (let i: number = 1; i < element.attributes.length; i++) {
                predicate += ` and @${element.attributes[i].name}='${element.attributes[i].value}'`;
            }
            predicate += ']';
            output.push(this.addPredicateToHead(xPath, predicate));
        }
        return output;
    }

    public transfAddPosition(xPath: string, element: Element): string[] {
        let output: string[] = [];
        if (!this.headHasPositionPredicate(xPath)) {
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
            output.push(this.addPredicateToHead(xPath, `[${position}]`));
        }
        return output;
    }

    public transfAddLevel(xPath: string, element: Element): string[] {
        let output: string[] = [];
        if (this.getXPathLength(xPath) < this.getAncestorCount(element) + 1) {
            output.push('//*' + xPath.substr(1));
        }
        return output;
    }

    private headHasAnyPredicates(xPath: string): boolean {
        return xPath.split('/')[2].includes('[');
    }

    private headHasPositionPredicate(xPath: string): boolean {
        let splitXPath: string[] = xPath.split('/');
        let regExp: RegExp = new RegExp('[[0-9]]');
        return splitXPath[2].includes('position()') || splitXPath[2].includes('last()') || regExp.test(splitXPath[2]);
    }

    private headHasTextPredicate(xPath: string): boolean {
        return xPath.split('/')[2].includes('text()');
    }

    private addPredicateToHead(xPath: string, predicate: string): string {
        let splitXPath: string[] = xPath.split('/');
        splitXPath[2] += predicate;
        return splitXPath.join('/');
    }

    private getAncestorCount(element: Element): number {
        let count: number = 0;
        while (element.parentElement) {
            element = element.parentElement;
            count++;
        }
        return count;
    }

    private getXPathLength(xPath: string): number {
        let splitXPath: string[] = xPath.split('/');
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
