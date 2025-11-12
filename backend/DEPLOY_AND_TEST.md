# HƯỚNG DẪN DEPLOY LÊN SEPOLIA TESTNET & TEST GIAO DỊCH THẬT

## ✅ BƯỚC 1: SETUP ENVIRONMENT

1. **Làm theo `SEPOLIA_SETUP.md`** để:
   - Lấy Sepolia ETH từ faucet
   - Lấy Infura/Alchemy RPC URL  
   - Export private key từ MetaMask
   - Cập nhật file `.env`

2. **Kiểm tra file `.env` có đầy đủ:**
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_actual_project_id
SEPOLIA_PRIVATE_KEY=0xyour_actual_private_key_here
USE_SEPOLIA=true
```

## ✅ BƯỚC 2: SWITCH SANG SEPOLIA

Chạy script để switch:
```bash
# Windows
switch-to-sepolia.bat

# Hoặc thủ công thêm vào .env:
# USE_SEPOLIA=true
```

## ✅ BƯỚC 3: COMPILE & DEPLOY CONTRACT

```bash
cd backend

# Compile smart contract
npm run compile

# Deploy lên Sepolia (cần ETH trong account)
npm run deploy:sepolia
```

**Output thành công:**
```
Deploying Certificate contract to Sepolia...
Certificate contract deployed to: 0x1234567890abcdef1234567890abcdef12345678
Transaction hash: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
Network: sepolia
Chain ID: 11155111
Updated certificate address in: /src/certificate.address.ts
Contract verified on Etherscan!
```

⚠️ **Nếu gặp lỗi:**
- `insufficient funds`: Cần thêm ETH từ faucet
- `invalid project id`: Kiểm tra SEPOLIA_RPC_URL  
- `invalid private key`: Kiểm tra SEPOLIA_PRIVATE_KEY format

## ✅ BƯỚC 4: KHỞI ĐỘNG BACKEND VỚI SEPOLIA

```bash
cd backend
npm run start:dev
```

**Kiểm tra log** - phải thấy:
```
Initializing blockchain service...
Current network mode: sepolia
Using RPC: https://sepolia.infura.io/v3/...
Chain ID: 11155111
Using contract address: 0x1234567890...
Signer address: 0xYourAddress...
Contract interface initialized successfully
```

## ✅ BƯỚC 5: KHỞI ĐỘNG FRONTEND

```bash
cd fe
npm start
```

Truy cập: http://localhost:3000

## ✅ BƯỚC 6: TEST GIAO DỊCH THẬT TRÊN SEPOLIA

### A. Setup MetaMask cho Sepolia:
1. **Thêm Sepolia Network vào MetaMask:**
   - Network Name: `Sepolia Test Network`
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID` 
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`

2. **Import account** (nếu dùng account khác để test):
   - Import private key đã dùng để deploy

### B. Test Issue Certificate:
1. **Đăng nhập** vào app với admin/issuer account
2. **Tạo certificate mới** (title, description, recipient)
3. **Click "Save to Blockchain"** hoặc "Issue Certificate"
4. **Đợi transaction** (1-2 phút để confirm)
5. **Lưu Transaction Hash** để verify sau

**💰 Chi phí:** ~0.001-0.002 ETH sẽ bị trừ từ account

### C. Test Verify Certificate:
1. **Vào trang Verify Certificate**
2. **Connect MetaMask** (click "Connect MetaMask")
3. **Switch sang Sepolia** nếu chưa đúng network
4. **Nhập Transaction Hash** từ bước Issue
5. **Click "Verify Certificate"**
6. **Xem kết quả verify**

**💰 Chi phí:** ~0.0005 ETH cho read operations (nếu có)

## ✅ BƯỚC 7: KIỂM TRA GIAO DỊCH TRÊN ETHERSCAN

1. **Truy cập:** https://sepolia.etherscan.io
2. **Nhập Transaction Hash** để xem chi tiết:
   - Gas fee đã trừ
   - Contract interaction  
   - Transaction status
   - Block confirmation

## ✅ CHUYỂN ĐỔI GIỮA LOCAL VÀ SEPOLIA

### Switch về Local (Development):
```bash
switch-to-local.bat
npx hardhat node  # Terminal riêng
npm run deploy:local
npm run start:dev
```

### Switch về Sepolia (Production Test):
```bash
switch-to-sepolia.bat  
npm run start:dev
```

## ✅ TROUBLESHOOTING

### Backend không connect Sepolia:
- Kiểm tra log: `Current network mode: sepolia`
- Kiểm tra `.env`: `USE_SEPOLIA=true`
- Restart backend: `Ctrl+C` → `npm run start:dev`

### MetaMask không hiện transaction:
- Đảm bảo đang ở Sepolia network
- Kiểm tra account có ETH
- Clear MetaMask cache: Settings → Advanced → Reset Account

### Contract address không đúng:
- Xem file `src/modules/blockchain/certificate.address.ts`
- Chạy lại `npm run deploy:sepolia` nếu cần

### Transaction failed:
- Kiểm tra gas price (có thể tăng trong hardhat.config.js)
- Kiểm tra account balance
- Xem lỗi chi tiết trên Sepolia Etherscan

## ✅ KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành, bạn sẽ có:

✅ **Smart contract** deploy trên Sepolia testnet thật  
✅ **Giao dịch có chi phí ETH** thực tế khi issue/verify certificate  
✅ **MetaMask confirmation** cho network switching  
✅ **Transaction tracking** trên Sepolia Etherscan  
✅ **Production-ready setup** cho blockchain certificate system  

**Chi phí ước tính:**
- Deploy contract: ~0.005 ETH
- Issue certificate: ~0.001 ETH  
- Verify certificate: ~0.0005 ETH
- **Total cần:** ~0.1 ETH để test đầy đủ