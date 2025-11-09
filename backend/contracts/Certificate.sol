// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    struct CertificateData {
        address issuer;
        address recipient;
        string title;
        string description;
        string issueDate;
        bool isValid;
    }

    mapping(uint256 => CertificateData) public certificates;
    uint256 public certificateCount;
    
    event CertificateIssued(
        uint256 indexed certId,
        address indexed issuer,
        address indexed recipient,
        string title
    );

    function issueCertificate(
        address recipient,
        string memory title,
        string memory description,
        string memory issueDate
    ) public returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(recipient != address(0), "Invalid recipient address");

        uint256 certId = certificateCount + 1;
        certificates[certId] = CertificateData({
            issuer: msg.sender,
            recipient: recipient,
            title: title,
            description: description,
            issueDate: issueDate,
            isValid: true
        });

        certificateCount = certId;
        emit CertificateIssued(certId, msg.sender, recipient, title);
        return certId;
    }

    function getCertificate(uint256 certId) public view returns (
        address issuer,
        address recipient,
        string memory title,
        string memory description,
        string memory issueDate,
        bool isValid
    ) {
        require(certId > 0 && certId <= certificateCount, "Certificate does not exist");
        CertificateData memory cert = certificates[certId];
        return (
            cert.issuer,
            cert.recipient,
            cert.title,
            cert.description,
            cert.issueDate,
            cert.isValid
        );
    }

    function getAllCertificates() public view returns (uint256[] memory) {
        uint256[] memory certIds = new uint256[](certificateCount);
        for(uint256 i = 0; i < certificateCount; i++) {
            certIds[i] = i + 1;
        }
        return certIds;
    }
}