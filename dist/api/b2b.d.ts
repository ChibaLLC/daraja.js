import { B2CResponseInterface } from "../models/interfaces";
import { _BuilderConfig } from "../utils";
import { MpesaResponse } from "../wrappers";
export declare class BusinessToBusiness {
    private config;
    private _initiator;
    private _amount;
    private _commandID;
    private _remarks;
    private _timeoutURL;
    private _resultURL;
    private _requester?;
    private _partyA;
    private _partyB;
    private _accountReference?;
    private _senderType;
    private _receiverType;
    constructor(config: _BuilderConfig);
    private _debugAssert;
    /**
     * Business/Organization shortcode
     *
     * @description A method that sets the shortcode of the organization receiving payment
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    shortCode(code: string): BusinessToBusiness;
    /**
     * Payer Phone Number
     *
     * @param {number} no The phone number of the payer in the format 254...
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    requester(no: number | string | undefined): BusinessToBusiness;
    /**
     * Payable amount
     *
     * @param {number} amount The amount to be paid to the the business
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    amount(amount: number): BusinessToBusiness;
    /**
     * Transaction type / Command ID
     *
     * @description Set the type of transaction taking place
     * @param  {"BusinessPayBill" | "BusinessBuyGoods"} type Unique command for each transaction type
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    transactionType(type: "BusinessPayBill" | "BusinessBuyGoods"): BusinessToBusiness;
    /**
     * Initiator Name
     *
     * @description A method to the initiator name for the transaction
     * @param  {string} name This is the credential/username used to authenticate the transaction request.
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    initiatorName(name: string): BusinessToBusiness;
    /**
     * Party B
     *
     * @description A method to set `partyB` shortcode to which money will be moved
     * @param {string} paybill The shortcode to which money will be moved
     * @returns {BusinessToBusiness}
     */
    payBill(paybill: string): this;
    /**
     * Party B
     *
     * @param till
     * @returns
     */
    tillNumber(till: string): this;
    /**
     * Account Reference
     *
     * @description A method to set the account reference.
     * @param {string} no The account number to be associated with the payment. Up to 13 characters.
     * @returns {BusinessToBusiness}
     */
    accountNumber(no: string): this;
    /**
     * Timeout URL/ Queue timeout url
     *
     * @description A method for setting the timeout URL
     * @param  {string} url The end-point that receives a timeout response.
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    timeoutURL(url: string): BusinessToBusiness;
    /**
     * Result URL
     *
     * @description A method for setting the Result URL
     * @param  {string} url The end-point that receives the response of the transaction
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    resultURL(url: string): BusinessToBusiness;
    /**
     * Remarks
     *
     * @description A method used to pass any additional remarks
     * @param  {string} value Comments that are sent along with the transaction.
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    remarks(value: string): BusinessToBusiness;
    /**
     * @param {"MSISDN" | "TILL" | "PAYBILL"} _type
     * @returns {BusinessToBusiness}
     */
    senderType(_type: "MSISDN" | "TILL" | "PAYBILL"): this;
    /**
     * @param {"MSISDN" | "TILL" | "PAYBILL"} _type
     * @returns {BusinessToBusiness}
     */
    receiverType(_type: "MSISDN" | "TILL" | "PAYBILL"): this;
    send(): Promise<B2BResponseWrapper>;
}
declare class B2BResponseWrapper implements MpesaResponse {
    data: B2CResponseInterface | any;
    constructor(data: B2CResponseInterface | any);
    isOkay(): boolean;
    getResponseCode(): string;
    getResponseDescription(): string;
}
export {};
