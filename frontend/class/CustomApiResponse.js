export class CustomApiResponse {
    responseType;
    responseMessage;
    constructor(responseType, responseMessage) {
        this.responseType = responseType;
        this.responseMessage = responseMessage;
    }
    static convertJson(jsonRaw) {
        return new CustomApiResponse(jsonRaw.status, jsonRaw.message);
    }
    getType() {
        return this.responseType;
    }
    getMessage() {
        return this.responseMessage;
    }
}