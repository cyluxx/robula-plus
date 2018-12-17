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

    public transfAddPosistion(xPath: string, element: Element): string[] {
        let output: string[] = [];
        if (!this.headHasPositionPredicate(xPath)) {

        }
        return output;
    }

    public transfAddLevel(xPath: string, element: Element): string[] {
        let output: string[] = [];
        
        return output;
    }

    private headHasAnyPredicates(xPath: string): boolean {
        return xPath.split('/')[2].includes('[');
    }

    private headHasPositionPredicate(xPath: string): boolean {
        return xPath.split('/')[2].includes('position()');
    }

    private headHasTextPredicate(xPath: string): boolean {
        return xPath.split('/')[2].includes('text()');
    }

    private addPredicateToHead(xPath: string, predicate: string): string {
        let splitXPath: string[] = xPath.split('/');
        splitXPath[2] += predicate;
        return splitXPath.join('/');
    }
}

export const uniquelyLocate = (x: XPathExpression, e: Element, d: Document): boolean => {
    return false;
};

class AlgorithmOptions {

}
