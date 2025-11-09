import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export interface CertificateInterface extends utils.Interface {
    functions: {
        "certificateCount()": FunctionFragment;
        "certificates(uint256)": FunctionFragment;
        "getAllCertificates()": FunctionFragment;
        "getCertificate(uint256)": FunctionFragment;
        "issueCertificate(address,string,string,string)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "certificateCount" | "certificates" | "getAllCertificates" | "getCertificate" | "issueCertificate"): FunctionFragment;
    encodeFunctionData(functionFragment: "certificateCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "certificates", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getAllCertificates", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCertificate", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "issueCertificate", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    decodeFunctionResult(functionFragment: "certificateCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "certificates", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAllCertificates", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCertificate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "issueCertificate", data: BytesLike): Result;
    events: {
        "CertificateIssued(uint256,address,address,string)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "CertificateIssued"): EventFragment;
}
export interface CertificateIssuedEventObject {
    certId: BigNumber;
    issuer: string;
    recipient: string;
    title: string;
}
export type CertificateIssuedEvent = TypedEvent<[
    BigNumber,
    string,
    string,
    string
], CertificateIssuedEventObject>;
export type CertificateIssuedEventFilter = TypedEventFilter<CertificateIssuedEvent>;
export interface Certificate extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: CertificateInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        certificateCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        certificates(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string,
            string,
            string,
            boolean
        ] & {
            issuer: string;
            recipient: string;
            title: string;
            description: string;
            issueDate: string;
            isValid: boolean;
        }>;
        getAllCertificates(overrides?: CallOverrides): Promise<[BigNumber[]]>;
        getCertificate(certId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string,
            string,
            string,
            boolean
        ] & {
            issuer: string;
            recipient: string;
            title: string;
            description: string;
            issueDate: string;
            isValid: boolean;
        }>;
        issueCertificate(recipient: PromiseOrValue<string>, title: PromiseOrValue<string>, description: PromiseOrValue<string>, issueDate: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    certificateCount(overrides?: CallOverrides): Promise<BigNumber>;
    certificates(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        string,
        string,
        string,
        string,
        boolean
    ] & {
        issuer: string;
        recipient: string;
        title: string;
        description: string;
        issueDate: string;
        isValid: boolean;
    }>;
    getAllCertificates(overrides?: CallOverrides): Promise<BigNumber[]>;
    getCertificate(certId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        string,
        string,
        string,
        string,
        boolean
    ] & {
        issuer: string;
        recipient: string;
        title: string;
        description: string;
        issueDate: string;
        isValid: boolean;
    }>;
    issueCertificate(recipient: PromiseOrValue<string>, title: PromiseOrValue<string>, description: PromiseOrValue<string>, issueDate: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        certificateCount(overrides?: CallOverrides): Promise<BigNumber>;
        certificates(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string,
            string,
            string,
            boolean
        ] & {
            issuer: string;
            recipient: string;
            title: string;
            description: string;
            issueDate: string;
            isValid: boolean;
        }>;
        getAllCertificates(overrides?: CallOverrides): Promise<BigNumber[]>;
        getCertificate(certId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string,
            string,
            string,
            boolean
        ] & {
            issuer: string;
            recipient: string;
            title: string;
            description: string;
            issueDate: string;
            isValid: boolean;
        }>;
        issueCertificate(recipient: PromiseOrValue<string>, title: PromiseOrValue<string>, description: PromiseOrValue<string>, issueDate: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "CertificateIssued(uint256,address,address,string)"(certId?: PromiseOrValue<BigNumberish> | null, issuer?: PromiseOrValue<string> | null, recipient?: PromiseOrValue<string> | null, title?: null): CertificateIssuedEventFilter;
        CertificateIssued(certId?: PromiseOrValue<BigNumberish> | null, issuer?: PromiseOrValue<string> | null, recipient?: PromiseOrValue<string> | null, title?: null): CertificateIssuedEventFilter;
    };
    estimateGas: {
        certificateCount(overrides?: CallOverrides): Promise<BigNumber>;
        certificates(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getAllCertificates(overrides?: CallOverrides): Promise<BigNumber>;
        getCertificate(certId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        issueCertificate(recipient: PromiseOrValue<string>, title: PromiseOrValue<string>, description: PromiseOrValue<string>, issueDate: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        certificateCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        certificates(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getAllCertificates(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCertificate(certId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        issueCertificate(recipient: PromiseOrValue<string>, title: PromiseOrValue<string>, description: PromiseOrValue<string>, issueDate: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
