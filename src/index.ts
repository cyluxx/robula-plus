/** 
* Returns a list of optimized robust XPath locators.
* 
* @param document - The document to analyse, that contains the desired element.
* @param absoluteXPath - A (non-optimized) XPath, describing the desired element.
* @param options - (optional) algorithm options
*
* @returns A list of robust XPath locators.
*/
export const robulaPlus = (document: Document, absoluteXPath: string, options?: AlgorithmOptions): void => {

};

export const evaluate = (abs: XPathExpression, d: Document): Element => {
    return new Element();
};

export class RobulaPlus {
    priorityAttributes: string[] = ["id"];

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
            for (let child of element.parentNode!.children) {
                if (element === child) {
                    break;
                }
                if (element.tagName === child.tagName) {
                    position++;
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

export const uniquelyLocate = (x: XPathExpression, e: Element, d: Document): boolean => {
    return false;
};

class AlgorithmOptions {

}
