# 🚀 HƯỚNG DẪN TEST ĐẨY CERTIFICATE LÊN SEPOLIA BLOCKCHAIN

## ✅ ĐÃ HOÀN THÀNH

- ✅ Contract deployed thành công lên Sepolia
- ✅ Contract Address: `0xD8e5B0C6b1038E34696B4F37F3658F46c4319916`
- ✅ Network: Sepolia Testnet (Chain ID: 11155111)
- ✅ Backend đang chạy với Sepolia RPC

## 🔥 BƯỚC TIẾP THEO - TEST THẬT

### 1️⃣ **Kiểm tra Backend đang chạy**

Backend đã khởi động, kiểm tra log phải thấy:
```
Initializing blockchain service...
Current network mode: sepolia
Using RPC: https://sepolia.infura.io/v3/ee8522bfa90649358e304ad5d48c42ed
Chain ID: 11155111
Using contract address: 0xD8e5B0C6b1038E34696B4F37F3658F46c4319916
Contract interface initialized successfully
Server started on http://localhost:8080
```

### 2️⃣ **Khởi động Frontend**

Mở terminal mới:
```bash
cd "D:\BlockChainPJ - Copy\fe"
npm start
```

Truy cập: http://localhost:3000

### 3️⃣ **Setup MetaMask cho Sepolia**

1. **Mở MetaMask**
2. **Thêm Sepolia Network** (nếu chưa có):
   - Network Name: `Sepolia Test Network`
   - RPC URL: `https://sepolia.infura.io/v3/ee8522bfa90649358e304ad5d48c42ed`
   - Chain ID: `11155111`
   - Currency: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`

3. **Switch sang Sepolia network**

### 4️⃣ **Test Issue Certificate (Đẩy lên Blockchain thật)**

1. **Đăng nhập** vào app (admin hoặc issuer)
2. **Tạo certificate mới:**
   - Recipient: `0xb83b1af256f277a697504427c9cb9191b0ec8f71` (hoặc bất kỳ address nào)
   - Title: `Test Certificate on Sepolia`
   - Description: `This is a real blockchain certificate`
   - Issue Date: chọn ngày

3. **Click "Save to Blockchain"** hoặc "Issue Certificate"

4. **ĐỢI GIAO DỊCH:**
   - Backend sẽ gửi transaction lên Sepolia
   - Mất 10-30 giây để confirm
   - **ETH sẽ bị trừ thật** từ account deploy (~0.001-0.002 ETH)

5. **Lưu Transaction Hash** được trả về

### 5️⃣ **Verify Certificate trên Blockchain**

1. **Vào trang Verify Certificate** trong app
2. **Nhập Transaction Hash** vừa nhận được
3. **Click "Verify Certificate"**
4. **Xem thông tin** được lấy từ blockchain

### 6️⃣ **Kiểm tra trên Sepolia Etherscan**

1. Truy cập: https://sepolia.etherscan.io
2. Tìm kiếm Transaction Hash hoặc Contract Address
3. Xem chi tiết:
   - Gas fee đã trả
   - Transaction status (Success/Failed)
   - Contract interaction
   - Block confirmation

**Contract trên Etherscan:**
https://sepolia.etherscan.io/address/0xD8e5B0C6b1038E34696B4F37F3658F46c4319916

## 💰 **Chi phí giao dịch thật:**

- **Issue Certificate**: ~0.001-0.002 ETH (~$2-4 USD nếu là mainnet)
- **Verify Certificate**: Read-only, không tốn phí
- **Mỗi transaction** đều có confirmation time 10-30 giây

## 🎯 **Kết quả mong đợi:**

✅ Certificate được lưu trên Sepolia blockchain thật
✅ Transaction hash có thể tra cứu trên Etherscan
✅ Dữ liệu không thể thay đổi (immutable)
✅ Gas fee được trừ từ account deploy
✅ Có block number và timestamp thật

## 🔧 **Troubleshooting:**

### "Insufficient funds"
- Kiểm tra balance: https://sepolia.etherscan.io/address/YOUR_ADDRESS
- Cần ít nhất 0.01 ETH cho nhiều transactions

### "Transaction failed"
- Kiểm tra gas price trong Etherscan
- Xem error message chi tiết
- Retry với gas limit cao hơn

### "Network mismatch"
- Đảm bảo USE_SEPOLIA=true trong .env
- Restart backend nếu cần

### Backend log errors
- Kiểm tra SEPOLIA_RPC_URL còn hoạt động
- Verify private key format (66 ký tự)

## 📊 **Monitor Transactions:**

Tất cả transactions từ deployment account:
https://sepolia.etherscan.io/address/0x[YOUR_DEPLOYER_ADDRESS]

Contract interactions:
https://sepolia.etherscan.io/address/0xD8e5B0C6b1038E34696B4F37F3658F46c4319916

---

**🎉 Chúc mừng! Bạn đã có hệ thống blockchain certificate hoàn chỉnh trên Sepolia testnet!**