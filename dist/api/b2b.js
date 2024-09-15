"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessToBusiness = void 0;
const routes_1 = require("../models/routes");
const utils_1 = require("../utils");
class BusinessToBusiness {
    constructor(config) {
        this.config = config;
    }
    _debugAssert() {
        if (!this._partyA) {
            this._partyA = String(this.config.shortCode);
        }
        if (this._commandID === "BusinessPayBill") {
            (0, utils_1.errorAssert)(this._accountReference, "Account number is required for Pay Bills");
        }
        else {
            this._accountReference = undefined;
        }
        (0, utils_1.errorAssert)(this._partyA, "Shortcode is required");
        (0, utils_1.errorAssert)(this._partyB, "Paybill is required");
        (0, utils_1.errorAssert)(this._amount, "Amount is required");
        (0, utils_1.errorAssert)(this._timeoutURL, "Timeout URL is required");
        (0, utils_1.errorAssert)(this._resultURL, "Result URL is required");
    }
    /**
     * Business/Organization shortcode
     *
     * @description A method that sets the shortcode of the organization receiving payment
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    shortCode(code) {
        this._partyA = code;
        return this;
    }
    /**
     * Payer Phone Number
     *
     * @param {number} no The phone number of the payer in the format 254...
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    requester(no) {
        var _a;
        if (typeof no === "string") {
            const phoneRegex = /(?:\+?254|07)\d{8}$/;
            let phone = (_a = no.match(phoneRegex)) === null || _a === void 0 ? void 0 : _a.join("");
            phone = phone === null || phone === void 0 ? void 0 : phone.replace("+", "");
            if (phone === null || phone === void 0 ? void 0 : phone.startsWith("0"))
                phone = `254${phone.slice(1)}`;
            no = phone;
        }
        else {
            return this.requester(`${no}`);
        }
        this._requester = no;
        return this;
    }
    /**
     * Payable amount
     *
     * @param {number} amount The amount to be paid to the the business
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    amount(amount) {
        this._amount = amount;
        return this;
    }
    /**
     * Transaction type / Command ID
     *
     * @description Set the type of transaction taking place
     * @param  {"BusinessPayBill" | "BusinessBuyGoods"} type Unique command for each transaction type
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    transactionType(type) {
        this._commandID = type;
        return this;
    }
    /**
     * Initiator Name
     *
     * @description A method to the initiator name for the transaction
     * @param  {string} name This is the credential/username used to authenticate the transaction request.
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    initiatorName(name) {
        this._initiator = name;
        return this;
    }
    /**
     * Party B
     *
     * @description A method to set `partyB` shortcode to which money will be moved
     * @param {string} paybill The shortcode to which money will be moved
     * @returns {BusinessToBusiness}
     */
    payBill(paybill) {
        this._partyB = paybill;
        return this;
    }
    /**
     * Account Reference
     *
     * @description A method to set the account reference.
     * @param {string} no The account number to be associated with the payment. Up to 13 characters.
     * @returns {BusinessToBusiness}
     */
    accountNumber(no) {
        this._accountReference = no;
        return this;
    }
    /**
     * Timeout URL/ Queue timeout url
     *
     * @description A method for setting the timeout URL
     * @param  {string} url The end-point that receives a timeout response.
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    timeoutURL(url) {
        this._timeoutURL = url;
        return this;
    }
    /**
     * Result URL
     *
     * @description A method for setting the Result URL
     * @param  {string} url The end-point that receives the response of the transaction
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    resultURL(url) {
        this._resultURL = url;
        return this;
    }
    /**
     * Remarks
     *
     * @description A method used to pass any additional remarks
     * @param  {string} value Comments that are sent along with the transaction.
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    remarks(value) {
        this._remarks = value;
        return this;
    }
    /**
     * @param {"MSISDN" | "TILL" | "PAYBILL"} _type
     * @returns {BusinessToBusiness}
     */
    senderType(_type) {
        switch (_type) {
            case "MSISDN":
                this._senderType = "1";
                break;
            case "TILL":
                this._senderType = "2";
                break;
            case "PAYBILL":
                this._senderType = "4";
                break;
            default:
                throw new Error(`Invalid Sender Type Passed, Options are: "MSISDN" | "TILL" | "PAYBILL"`);
        }
        return this;
    }
    /**
     * @param {"MSISDN" | "TILL" | "PAYBILL"} _type
     * @returns {BusinessToBusiness}
     */
    receiverType(_type) {
        switch (_type) {
            case "MSISDN":
                this._receiverType = "1";
                break;
            case "TILL":
                this._receiverType = "2";
                break;
            case "PAYBILL":
                this._receiverType = "4";
                break;
            default:
                throw new Error(`Invalid Receiver Type Passed, Options are: "MSISDN" | "TILL" | "PAYBILL"`);
        }
        return this;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            this._debugAssert();
            const app = this.config;
            const token = yield app.getAuthToken();
            if (!this._receiverType) {
                this._receiverType = this._commandID === "BusinessPayBill" ? "4" : "2";
            }
            try {
                const data = yield app.http.post(routes_1.routes.b2b, {
                    InitiatorName: this._initiator,
                    Amount: this._amount,
                    CommandID: this._commandID,
                    Remarks: this._remarks,
                    QueueTimeOutURL: this._timeoutURL,
                    ResultURL: this._resultURL,
                    RecieverIdentifierType: this._receiverType,
                    SenderIdentifierType: this._senderType,
                    PartyA: this._partyA,
                    PartyB: this._partyB,
                    AccountReference: this._accountReference,
                    Requester: this._requester
                }, {
                    Authorization: `Bearer ${token}`
                });
                const values = new B2BResponseWrapper(data);
                return Promise.resolve(values);
            }
            catch (error) {
                return (0, utils_1.handleError)(error);
            }
        });
    }
}
exports.BusinessToBusiness = BusinessToBusiness;
class B2BResponseWrapper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data) {
        this.data = data;
    }
    isOkay() {
        return (this.data.ResponseCode === "0" &&
            this.data.ResponseDescription.toLowerCase().includes("success"));
    }
    getResponseCode() {
        return this.data.ResponseCode;
    }
    getResponseDescription() {
        return this.data.ResponseDescription;
    }
}
//# sourceMappingURL=b2b.js.map