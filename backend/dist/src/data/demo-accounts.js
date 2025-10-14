"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoAccounts = void 0;
exports.demoAccounts = [
    {
        username: 'admin',
        password: 'admin123',
        email: 'admin@certchain.com',
        role: 'admin',
    },
    {
        username: 'issuer1',
        password: 'issuer123',
        email: 'issuer1@school.edu',
        role: 'issuer',
        organization: 'Trường Đại học A',
    },
    {
        username: 'issuer2',
        password: 'issuer123',
        email: 'issuer2@school.edu',
        role: 'issuer',
        organization: 'Trường Đại học B',
    },
    {
        username: 'issuer3',
        password: 'issuer123',
        email: 'issuer3@company.com',
        role: 'issuer',
        organization: 'Trung tâm đào tạo C',
    },
    ...[...Array(16)].map((_, index) => ({
        username: `student${index + 1}`,
        password: 'student123',
        email: `student${index + 1}@gmail.com`,
        role: 'user',
        fullName: `Học viên ${index + 1}`,
        studentId: `ST${String(index + 1).padStart(4, '0')}`,
    })),
];
//# sourceMappingURL=demo-accounts.js.map