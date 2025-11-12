# HƯỚNG DẪN SETUP SEPOLIA TESTNET

## BƯỚC 1: LẤY SEPOLIA ETH MIỄN PHÍ

Thử các faucet này (một số yêu cầu đăng ký/social media):

### Faucet hoạt động tốt 2024-2025:
1. **Alchemy Faucet** (Khuyến nghị - ít hạn chế):
   - Link: https://www.alchemy.com/faucets/ethereum-sepolia
   - Yêu cầu: Đăng ký tài khoản Alchemy miễn phí
   - Lượng: 0.5 ETH/ngày

2. **Infura Faucet**:
   - Link: https://www.infura.io/faucet/sepolia
   - Yêu cầu: Đăng ký tài khoản Infura
   - Lượng: 0.1 ETH/ngày

3. **QuickNode Faucet**:
   - Link: https://faucet.quicknode.com/ethereum/sepolia
   - Yêu cầu: Kết nối X (Twitter)
   - Lượng: 0.05 ETH/ngày

4. **LearnWeb3 Faucet**:
   - Link: https://learnweb3.io/faucets/sepolia
   - Yêu cầu: GitHub account
   - Lượng: 0.025 ETH/ngày

### Nếu vẫn không lấy được ETH:
- Tạo nhiều tài khoản MetaMask và thử từng tài khoản
- Hoặc dùng **Holesky testnet** (dễ lấy ETH hơn) - tôi sẽ cấu hình thêm

## BƯỚC 2: LẤY INFURA/ALCHEMY RPC KEY

### Infura (Khuyến nghị):
1. Đăng ký: https://infura.io/
2. Create New API Key → Choose "Web3 API"
3. Copy Project ID (VD: `abc123def456...`)
4. RPC URL sẽ là: `https://sepolia.infura.io/v3/abc123def456...`

### Alchemy (Thay thế):
1. Đăng ký: https://www.alchemy.com/
2. Create App → Chọn Ethereum Sepolia
3. Copy API Key
4. RPC URL: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

## BƯỚC 3: LẤY PRIVATE KEY TỪ METAMASK

1. Mở MetaMask
2. Click 3 dots → Account Details
3. Export Private Key
4. Nhập password MetaMask
5. Copy private key (bắt đầu bằng 0x...)

**⚠️ LƯU Ý BẢO MẬT:**
- Chỉ dùng test account, KHÔNG dùng account chính
- Private key này sẽ lưu trong file .env - không chia sẻ
- Account này cần có ít nhất 0.1 ETH để deploy + test

## BƯỚC 4: CẬP NHẬT FILE .ENV

Mở file `backend/.env` và cập nhật:

```env
# Sepolia Testnet Configuration  
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID_HERE
SEPOLIA_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY_HERE

# Existing config...
RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CLOUDINARY_CLOUD_NAME=duhi7od89
CLOUDINARY_API_KEY=489491828746492
CLOUDINARY_API_SECRET=bamHT41_EBSl189mlF76jub3k60
```

**Thay thế**:
- `YOUR_PROJECT_ID_HERE` → Project ID từ Infura
- `0xYOUR_PRIVATE_KEY_HERE` → Private key từ MetaMask (phải có 0x ở đầu)
- `YOUR_ETHERSCAN_API_KEY_HERE` → API key từ etherscan.io/apis (optional, để verify contract)

## BƯỚC 5: TEST KẾT NỐI

Sau khi cập nhật .env, chạy lệnh test:

```bash
cd backend
npm run compile
npm run deploy:sepolia
```

Nếu thành công, bạn sẽ thấy:
```
Certificate contract deployed to: 0x1234567890...
Transaction hash: 0xabcdef...
Network: sepolia
Chain ID: 11155111
```

## KHẮC PHỤC LỖI THƯỜNG GẶP

### "insufficient funds for intrinsic transaction cost"
- **Nguyên nhân**: Account không đủ ETH
- **Giải pháp**: Lấy thêm ETH từ faucet

### "invalid project id" / "unauthorized"
- **Nguyên nhân**: RPC URL sai hoặc API key sai
- **Giải pháp**: Kiểm tra lại SEPOLIA_RPC_URL

### "invalid private key"
- **Nguyên nhân**: Private key format sai
- **Giải pháp**: Đảm bảo có 0x ở đầu và đúng 64 ký tự hex

### "network does not support ENS"
- **Nguyên nhân**: Cấu hình network chưa đúng
- **Giải pháp**: Đã fix trong hardhat.config.js mới

Hoàn thành setup này, bạn sẽ có:
✅ Contract deploy trên Sepolia testnet thật
✅ Giao dịch có chi phí ETH thực tế  
✅ MetaMask confirmation cho mọi transaction
✅ Có thể track trên https://sepolia.etherscan.io