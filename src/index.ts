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

    public transfConvertStar(xPath: string, tag: string): string[] {
        let output: string[] = [];
        if (xPath.startsWith("//*")) {
            output.push("//" + tag + xPath.substring(3));
        }
        return output;
    };

    public transfAddAttribute(xPath: string, element: Element): string[]{
        let output: string[] = [];
        if(xPath.charAt(xPath.length - 1)){
            for(let attribute of element.attributes){
                let splitXPath: string[] = xPath.split('/');
                splitXPath.splice(3, 0, `[@${attribute.name}='${attribute.value}']`);
                output.push(splitXPath.join());
            }
        }
        return output;
    }
}

export const uniquelyLocate = (x: XPathExpression, e: Element, d: Document): boolean => {
    return false;
};

class AlgorithmOptions {

}
