export class RequestHandler {
    constructor(request) {
        this._request = request
    }

    async handleRequest() {
        return fetch(this._request)
    }
}