import { B2BInterface, B2CResponseInterface, CommandID, IdentifierType } from "../models/interfaces";
import { routes } from "../models/routes";
import { _BuilderConfig, errorAssert, handleError } from "../utils";
import { MpesaResponse } from "../wrappers";

export class BusinessToBusiness {
    private _initiator: string;
    private _amount: number;
    private _commandID: CommandID;
    private _remarks: string;
    private _timeoutURL: string;
    private _resultURL: string;
    private _requester?: string;
    private _partyA: string;
    private _partyB: string;
    private _accountReference?: string;
    private _senderType: IdentifierType;
    private _receiverType: IdentifierType;


    constructor(private config: _BuilderConfig) { }

    private _debugAssert() {
        if (!this._partyA) {
            this._partyA = String(this.config.shortCode);
        }

        if (this._commandID === "BusinessPayBill") {
            errorAssert(this._accountReference, "Account number is required for Pay Bills");
        } else {
            this._accountReference = undefined;
        }

        errorAssert(this._partyA, "Shortcode is required");
        errorAssert(this._partyB, "Paybill is required");
        errorAssert(this._amount, "Amount is required");
        errorAssert(this._timeoutURL, "Timeout URL is required");
        errorAssert(this._resultURL, "Result URL is required");
    }


    /**
     * Business/Organization shortcode
     *
     * @description A method that sets the shortcode of the organization receiving payment
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    public shortCode(code: string): BusinessToBusiness {
        this._partyA = code;
        return this;
    }

    /**
     * Payer Phone Number
     *
     * @param {number} no The phone number of the payer in the format 254...
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    public requester(no: number | string | undefined): BusinessToBusiness {
        if (typeof no === "string") {
            const phoneRegex = /(?:\+?254|07)\d{8}$/
            let phone = no.match(phoneRegex)?.join("")
            phone = phone?.replace("+", "")
            if (phone?.startsWith("0")) phone = `254${phone.slice(1)}`
            no = phone
        } else {
            return this.requester(`${no}`)
        }

        this._requester = no
        return this
    }

    /**
     * Payable amount
     *
     * @param {number} amount The amount to be paid to the the business
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    public amount(amount: number): BusinessToBusiness {
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
    public transactionType(
        type: "BusinessPayBill" | "BusinessBuyGoods"
    ): BusinessToBusiness {
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
    public initiatorName(name: string): BusinessToBusiness {
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
    public payBill(paybill: string) {
        this._partyB = paybill
        return this
    }

    /**
     * Account Reference
     * 
     * @description A method to set the account reference.
     * @param {string} no The account number to be associated with the payment. Up to 13 characters.
     * @returns {BusinessToBusiness}
     */
    public accountNumber(no: string) {
        this._accountReference = no
        return this
    }

    /**
     * Timeout URL/ Queue timeout url
     *
     * @description A method for setting the timeout URL
     * @param  {string} url The end-point that receives a timeout response.
     * @returns {BusinessToBusiness} Returns a reference to the B2C object for further manipulation
     */
    public timeoutURL(url: string): BusinessToBusiness {
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
    public resultURL(url: string): BusinessToBusiness {
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
    public remarks(value: string): BusinessToBusiness {
        this._remarks = value;
        return this;
    }

    /**
     * @param {"MSISDN" | "TILL" | "PAYBILL"} _type
     * @returns {BusinessToBusiness}
     */
    public senderType(_type: "MSISDN" | "TILL" | "PAYBILL") {
        switch (_type) {
            case "MSISDN":
                this._senderType = "1"
                break;
            case "TILL":
                this._senderType = "2"
                break;
            case "PAYBILL":
                this._senderType = "4"
                break;
            default:
                throw new Error(`Invalid Sender Type Passed, Options are: "MSISDN" | "TILL" | "PAYBILL"`)
        }

        return this
    }

    /**
     * @param {"MSISDN" | "TILL" | "PAYBILL"} _type
     * @returns {BusinessToBusiness}
     */
    public receiverType(_type: "MSISDN" | "TILL" | "PAYBILL") {
        switch (_type) {
            case "MSISDN":
                this._receiverType = "1"
                break;
            case "TILL":
                this._receiverType = "2"
                break;
            case "PAYBILL":
                this._receiverType = "4"
                break;
            default:
                throw new Error(`Invalid Receiver Type Passed, Options are: "MSISDN" | "TILL" | "PAYBILL"`)
        }

        return this
    }

    public async send(): Promise<B2BResponseWrapper> {
        this._debugAssert();

        const app = this.config;
        const token = await app.getAuthToken();

        if (!this._receiverType) {
            this._receiverType = this._commandID === "BusinessPayBill" ? "4" : "2"
        }

        try {
            const data = await app.http.post<B2BInterface>(
                routes.b2b,
                {
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
                },
                {
                    Authorization: `Bearer ${token}`
                }
            )

            const values = new B2BResponseWrapper(data)
            return Promise.resolve(values)
        } catch (error) {
            return handleError(error)
        }
    }
}


class B2BResponseWrapper implements MpesaResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(public data: B2CResponseInterface | any) { }

    public isOkay(): boolean {
        return (
            this.data.ResponseCode === "0" &&
            this.data.ResponseDescription.toLowerCase().includes("success")
        );
    }

    public getResponseCode(): string {
        return this.data.ResponseCode;
    }

    public getResponseDescription(): string {
        return this.data.ResponseDescription;
    }
}