// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Check if your contract looks like this:
contract Certificate {
    struct CertificateData {
        address issuer;
        address recipient;
        string title;
        string description;
        string issueDate;
    }
    
    // Certificate storage
    mapping(uint256 => CertificateData) public certificates;
    uint256 public certCount;
    
    // Events
    event CertificateIssued(uint256 certId, address indexed recipient, address indexed issuer);
    
    function issueCertificate(
        address recipient,
        string memory title,
        string memory description,
        string memory issueDate
    ) public returns (uint256) {
        uint256 certId = certCount;
        certificates[certId] = CertificateData(
            msg.sender,
            recipient,
            title,
            description,
            issueDate
        );
        certCount++;
        
        emit CertificateIssued(certId, recipient, msg.sender);
        
        return certId;
    }
    
    function getCertificate(uint256 certId) public view returns (
        address issuer,
        address recipient,
        string memory title,
        string memory description,
        string memory issueDate
    ) {
        require(certId < certCount, "Certificate does not exist");
        CertificateData memory cert = certificates[certId];
        return (
            cert.issuer,
            cert.recipient,
            cert.title,
            cert.description,
            cert.issueDate
        );
    }
}