import {xmlToJson} from "../util/xmlJsonUtils.js";

const NOMINATIM_API = 'https://nominatim.openstreetmap.org'

const deduceSettlementType = (address) => {
    const settlementTypes = ['city', 'town', 'village']
    const addressParts = Object.keys(address)
    for (const type of settlementTypes) {
        if (addressParts.includes(type)) {
            return type
        }
    }
    return undefined
}

const reverseGeoCodeByLatLong = async (lat, long) => {
    let response = await fetch(`${NOMINATIM_API}/reverse?lon=${long}&lat=${lat}&namedetails=1`)
    if (!response.ok) {
        return undefined
    }
    const xml = await response.text()
    const json = xmlToJson(xml)
    return json['reversegeocode']
}

export const reverseAddressNameByLatLong = async (latitude, longitude) => {
    const reverseGeoCode = await reverseGeoCodeByLatLong(latitude, longitude)
    if (!reverseGeoCode) {
        return undefined
    }
    console.log(reverseGeoCode)
    const nameDetails = reverseGeoCode['namedetails']
    if (!nameDetails || Object.keys(nameDetails).length === 0) {
        return reverseGeoCode['result']._text
    }

    const addressParts = reverseGeoCode['addressparts']
    const settlementType = deduceSettlementType(addressParts)
    const settlement = addressParts[settlementType]._text
    if (nameDetails['name'] instanceof Array) {
        return settlement + ', ' + nameDetails['name'][0]._text
    }
    else {
        return settlement + ', ' + nameDetails['name']._text
    }
}

export const reverseAddressPartsByLatLong = async (latitude, longitude) => {
    const reverseGeoCode = await reverseGeoCodeByLatLong(latitude, longitude)
    if (!reverseGeoCode) {
        return undefined
    }
    console.log(reverseGeoCode)
    const address = reverseGeoCode['addressparts']

    const country = address['country']._text
    const settlementType = deduceSettlementType(address)
    const settlement = address[settlementType]._text
    return { country, settlement }
}