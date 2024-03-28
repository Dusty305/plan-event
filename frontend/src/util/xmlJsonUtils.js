import converter from "xml-js";

export const xmlToJson = (xml) => {
    const options = {
        compact: true,
        ignoreAttributes: false
    };
    const jsonStr = converter.xml2json(xml, options)
    return JSON.parse(jsonStr)
}