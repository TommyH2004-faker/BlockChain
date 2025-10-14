"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateABI = void 0;
exports.CertificateABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "studentName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "course",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "grade",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "issueDate",
                "type": "string"
            }
        ],
        "name": "issueCertificate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "certId",
                "type": "uint256"
            }
        ],
        "name": "getCertificate",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "studentName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "course",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "grade",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "issueDate",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "issuer",
                        "type": "address"
                    }
                ],
                "internalType": "struct Certificate.CertificateData",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
//# sourceMappingURL=certificate.abi.js.map