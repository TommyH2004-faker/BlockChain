# HƯỚNG DẪN DEPLOY LÊN SEPOLIA TESTNET

## BƯỚC 1: CÀI ĐẶT PREREQUISITES

1. **Cài đặt MetaMask**: https://metamask.io/
2. **Lấy Sepolia ETH miễn phí**:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - Cần ít nhất 0.1 ETH cho việc deploy và test

## BƯỚC 2: LẤY THÔNG TIN CẦN THIẾT

1. **Infura API Key**:
   - Đăng ký tài khoản tại: https://infura.io/
   - Tạo project mới
   - Copy API Key (Project ID)

2. **Private Key từ MetaMask**:
   - Mở MetaMask → Account details → Export Private Key
   - **LƯU Ý**: Chỉ dùng test account, KHÔNG dùng account chính

3. **Etherscan API Key** (Optional):
   - Đăng ký tại: https://etherscan.io/apis
   - Dùng để verify contract

## BƯỚC 3: CẤU HÌNH ENVIRONMENT

Mở file `backend/.env` và cập nhật:

```env
# Sepolia Testnet Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
SEPOLIA_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY_HERE

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=duhi7od89
CLOUDINARY_API_KEY=489491828746492
CLOUDINARY_API_SECRET=bamHT41_EBSl189mlF76jub3k60
```

**Thay thế**:
- `YOUR_INFURA_PROJECT_ID` với Project ID từ Infura
- `YOUR_PRIVATE_KEY_HERE` với Private Key từ MetaMask (bao gồm cả 0x)
- `YOUR_ETHERSCAN_API_KEY_HERE` với API key từ Etherscan

## BƯỚC 4: COMPILE VÀ DEPLOY CONTRACT

```bash
cd backend

# Compile contract
npm run compile

# Deploy lên Sepolia (cần có ETH trong account)
npm run deploy:sepolia
```

**Output mong đợi**:
```
Certificate contract deployed to: 0x1234567890123456789012345678901234567890
Transaction hash: 0xabcdef...
Network: sepolia
Chain ID: 11155111
Contract verified on Etherscan!
```

## BƯỚC 5: CẤU HÌNH METAMASK CHO SEPOLIA

1. **Thêm Sepolia Network vào MetaMask**:
   - Network Name: `Sepolia Test Network`
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`

2. **Import account** (nếu cần):
   - Import private key đã dùng để deploy

## BƯỚC 6: CHẠY VÀ TEST ỨNG DỤNG

```bash
# Terminal 1: Start backend
cd backend
npm run start:dev

# Terminal 2: Start frontend  
cd fe
npm start
```

## BƯỚC 7: TEST VERIFY CERTIFICATE

1. **Truy cập**: http://localhost:3000
2. **Đăng nhập** với tài khoản admin/issuer
3. **Kết nối MetaMask**:
   - Click "Connect MetaMask" 
   - Chọn account có ETH
   - Switch sang Sepolia network
4. **Issue Certificate**:
   - Tạo certificate mới
   - Click "Save to Blockchain"
   - **Confirm transaction trên MetaMask** → ETH sẽ bị trừ
   - Lưu lại Transaction Hash
5. **Verify Certificate**:
   - Vào trang Verify
   - Nhập Transaction Hash
   - Click "Verify" → **MetaMask sẽ hiện confirm transaction** → ETH bị trừ
   - Xem kết quả verify

## XỬ LÝ LỖI THƯỜNG GẶP

### "Insufficient funds for gas"
- **Nguyên nhân**: Không đủ ETH trong account
- **Giải pháp**: Lấy thêm ETH từ faucet

### "Network not supported" 
- **Nguyên nhân**: MetaMask chưa có Sepolia network
- **Giải pháp**: Thêm network theo Bước 5

### "Contract deployment failed"
- **Nguyên nhân**: Private key sai hoặc không đủ ETH
- **Giải pháp**: Kiểm tra lại .env file và balance

### "Transaction failed"
- **Nguyên nhân**: Gas limit thấp hoặc contract lỗi
- **Giải pháp**: Kiểm tra transaction trên Sepolia Etherscan

## KIỂM TRA GIAO DỊCH

- **Sepolia Etherscan**: https://sepolia.etherscan.io
- Nhập Transaction Hash để xem chi tiết
- Xem gas fee đã trừ
- Xem contract interaction

## LƯU Ý QUAN TRỌNG

1. **Chi phí thực tế**: Mỗi transaction sẽ tốn ETH thật (testnet ETH)
2. **Gas fees**: Issue certificate ~0.001 ETH, Verify ~0.0005 ETH
3. **Confirmations**: Giao dịch cần 1-2 phút để confirm
4. **MetaMask popup**: Luôn có confirmation popup cho mọi transaction
5. **Transaction Hash**: Lưu lại để tracking và verify sau

## SWITCH VỀ LOCAL (NẾU CẦN)

Để switch về Hardhat local:
1. Đổi `CURRENT_NETWORK = 'hardhat'` trong `certificate.address.ts`
2. Start Hardhat node: `npx hardhat node`
3. Deploy local: `npx hardhat run scripts/deploy-certificate.mjs --network localhost`
4. Switch MetaMask về Hardhat Local network