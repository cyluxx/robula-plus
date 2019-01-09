/**
    * Main class, containing the Algorithm.
    * 
    * @remarks For more information on how the algorithm works, please refer to: 
    * Maurizio Leotta, Andrea Stocco, Filippo Ricca, Paolo Tonella. ROBULA+:
    * An Algorithm for Generating Robust XPath Locators for Web Testing. Journal
    * of Software: Evolution and Process (JSEP), Volume 28, Issue 3, pp.177–204.
    * John Wiley & Sons, 2016. 
    * https://doi.org/10.1002/smr.1771
    * 
    * @param options - (optional) algorithm options.
    */
export class RobulaPlus {
    private attributePriorizationList: string[] = ["name", "class", "title", "alt", "value"];
    private attributeBlackList: string[] = ["href", "src", "onclick", "onload", "tabindex", "width", "height", "style", "size", "maxlength"];

    constructor(options?: RobulaPlusOptions) {
        if (options) {
            this.attributePriorizationList = options.attributePriorizationList;
            this.attributeBlackList = options.attributeBlackList;
        }
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
            //add priority attributes to output
            for (let priorityAttribute of this.attributePriorizationList) {
                for (let attribute of ancestor.attributes) {
                    if (attribute.name === priorityAttribute) {
                        let newXPath: XPath = new XPath(xPath.getValue());
                        newXPath.addPredicateToHead(`[@${attribute.name}='${attribute.value}']`);
                        output.push(newXPath);
                        break;
                    }
                }
            }
            //append all other non-blacklist attributes to output
            for (let attribute of ancestor.attributes) {
                if (!this.attributeBlackList.includes(attribute.name) && !this.attributePriorizationList.includes(attribute.name)) {
                    let newXPath: XPath = new XPath(xPath.getValue());
                    newXPath.addPredicateToHead(`[@${attribute.name}='${attribute.value}']`);
                    output.push(newXPath);
                }
            }
        }
        return output;
    }

    public transfAddAttributeSet(xPath: XPath, element: Element): XPath[] {
        let output: XPath[] = [];
        let ancestor: Element = this.getAncestor(element, xPath.getLength() - 1);
        if (!xPath.headHasAnyPredicates()) {
            //add id to attributePriorizationList
            this.attributePriorizationList.unshift('id');
            let attributes: Attr[] = [...ancestor.attributes];

            //remove black list attributes
            attributes = attributes.filter(attribute => !this.attributeBlackList.includes(attribute.name));

            //generate power set
            let attributePowerSet: Attr[][] = this.generatePowerSet(attributes);

            //remove sets with cardinality < 2
            attributePowerSet = attributePowerSet.filter(attributeSet => attributeSet.length >= 2);

            //sort by attribute priority
            let temp: Attr[][];
            for (let priorityAttribute of this.attributePriorizationList) {
                temp = [];
                for (let i: number = 0; i < attributePowerSet.length;) {
                    let containsConcretePriorityAttribute: boolean = false;
                    for (let attribute of attributePowerSet[i]) {
                        if (attribute.name === priorityAttribute) {
                            containsConcretePriorityAttribute = true;
                            break;
                        }
                    }
                    if (containsConcretePriorityAttribute) {
                        temp.push(attributePowerSet[i]);
                        attributePowerSet.splice(i, 1);
                    }
                    else {
                        i++;
                    }
                }
                attributePowerSet = attributePowerSet.concat(temp);
            }

            //append non priority attributes to end
            temp = [];
            for (let i: number = 0; i < attributePowerSet.length;) {
                let containsAnyPriorityAttribute: boolean = false;
                for (let attribute of attributePowerSet[i]) {
                    if (this.attributePriorizationList.includes(attribute.name)) {
                        containsAnyPriorityAttribute = true;
                        break;
                    }
                }
                if (!containsAnyPriorityAttribute) {
                    temp.push(attributePowerSet[i]);
                    attributePowerSet.splice(i, 1);
                }
                else {
                    i++;
                }
            }
            attributePowerSet = attributePowerSet.concat(temp);

            //sort by cardinality
            for (let cardinality: number = 2; cardinality <= attributes.length; cardinality++) {
                temp = [];
                for (let i: number = 0; i < attributePowerSet.length;) {
                    if (attributePowerSet[i].length === cardinality) {
                        temp.push(attributePowerSet[i]);
                        attributePowerSet.splice(i, 1);
                    }
                    else {
                        i++;
                    }
                }
                attributePowerSet = attributePowerSet.concat(temp);
            }

            //remove id from attributePriorizationList
            this.attributePriorizationList.shift();

            //convert to predicate
            for (let attributeSet of attributePowerSet) {
                let predicate: string = `[@${attributeSet[0].name}='${attributeSet[0].value}'`;
                for (let i: number = 1; i < attributeSet.length; i++) {
                    predicate += ` and @${attributeSet[i].name}='${attributeSet[i].value}'`;
                }
                predicate += ']';
                let newXPath: XPath = new XPath(xPath.getValue());
                newXPath.addPredicateToHead(predicate);
                output.push(newXPath);
            }
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

    private generatePowerSet(input: Attr[]): Attr[][] {
        return input.reduce(
            (subsets: Attr[][], value: Attr) => subsets.concat(
                subsets.map((set: Attr[]) => [value, ...set])
            ),
            [[]]
        );
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
    /**
     * @attribute - attributePriorizationList: A prioritized list of HTML attributes, which are considered in the given order.
     * @attribute - attributeBlackList: Contains HTML attributes, which are classified as too fragile and are ignored by the algorithm.
     */

    attributePriorizationList: string[] = ["name", "class", "title", "alt", "value"];
    attributeBlackList: string[] = ["href", "src", "onclick", "onload", "tabindex", "width", "height", "style", "size", "maxlength"];
}