# 🎯 HƯỚNG DẪN LẤY SEPOLIA ETH VÀ DEPLOY

## ✅ BƯỚC 1: LẤY SEPOLIA ETH (MIỄN PHÍ)

Account hiện tại cần ETH: `0x70997970c51812dc3a010c7d01b50e0d17dc79c8`

### Faucet ETH miễn phí (chọn 1 trong các cách):

#### 🟢 **Alchemy Sepolia Faucet** (Khuyến nghị - ít hạn chế):
1. Truy cập: https://www.alchemy.com/faucets/ethereum-sepolia
2. Đăng ký tài khoản miễn phí
3. Nhập address: `0x70997970c51812dc3a010c7d01b50e0d17dc79c8`
4. Nhận 0.5 ETH/ngày

#### 🟡 **QuickNode Faucet** (Cần Twitter):
1. Truy cập: https://faucet.quicknode.com/ethereum/sepolia  
2. Kết nối X (Twitter)
3. Nhập address: `0x70997970c51812dc3a010c7d17dc79c8`
4. Nhận 0.05 ETH

#### 🔵 **LearnWeb3 Faucet** (Cần GitHub):
1. Truy cập: https://learnweb3.io/faucets/sepolia
2. Kết nối GitHub account
3. Nhập address: `0x70997970c51812dc3a010c7d01b50e0d17dc79c8`  
4. Nhận 0.025 ETH

#### 🟠 **Thirdweb Faucet**:
1. Truy cập: https://thirdweb.com/sepolia/faucet
2. Connect wallet hoặc nhập address: `0x70997970c51812dc3a010c7d01b50e0d17dc79c8`
3. Nhận ETH miễn phí

## ✅ BƯỚC 2: KIỂM TRA BALANCE

```bash
# Kiểm tra balance account (từ PowerShell)
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "latest"],"id":1}' https://ethereum-sepolia-rpc.publicnode.com
```

Hoặc kiểm tra trên: https://sepolia.etherscan.io/address/0x70997970c51812dc3a010c7d01b50e0d17dc79c8

## ✅ BƯỚC 3: DEPLOY NGAY SAU KHI CÓ ETH

```bash
cd "D:\BlockChainPJ - Copy\backend"
npm run deploy:sepolia
```

**Output khi thành công:**
```
Certificate contract deployed to: 0x1234567890abcdef...
Transaction hash: 0xabcdef123456789...
Network: sepolia
Chain ID: 11155111
Updated certificate address files
```

## ✅ BƯỚC 4: KHỞI ĐỘNG BACKEND VỚI SEPOLIA

```bash
npm run start:dev
```

**Kiểm tra log** - phải thấy:
```
Current network mode: sepolia
Using RPC: https://ethereum-sepolia-rpc.publicnode.com
Chain ID: 11155111
```

## ✅ BƯỚC 5: SETUP METAMASK

1. **Thêm Sepolia Network:**
   - Network Name: `Sepolia Test Network`
   - RPC URL: `https://ethereum-sepolia-rpc.publicnode.com`
   - Chain ID: `11155111`
   - Currency: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`

2. **Import Private Key để test:**
   - Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
   - Address: `0x70997970c51812dc3a010c7d01b50e0d17dc79c8`

## ✅ BƯỚC 6: TEST GIAO DỊCH THẬT

```bash
cd "../fe"
npm start
```

1. **Connect MetaMask** với account trên
2. **Switch sang Sepolia network**  
3. **Issue certificate** → ETH sẽ bị trừ thật
4. **Verify certificate** → Track trên Etherscan

## 🔧 NHANH HƠN - DÙNG HARDHAT LOCAL

Nếu muốn test nhanh không cần faucet:

```bash
# Terminal 1: Chạy Hardhat node
npx hardhat node

# Terminal 2: Deploy local
switch-to-local.bat
npm run deploy:local
npm run start:dev
```

---

**💡 TIP:** Cần ít nhất 0.01 ETH để deploy contract. Sau deploy thành công, mỗi transaction sẽ tốn ~0.001 ETH.

**🎯 Mục tiêu:** Sau bước này bạn sẽ có blockchain certificate system hoàn chỉnh trên Sepolia testnet với giao dịch ETH thật!