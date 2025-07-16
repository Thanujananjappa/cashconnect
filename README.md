# CashConnect 💸

**CashConnect** is a peer-to-peer cash assistance platform designed for real-world travel scenarios. It connects travelers who urgently need cash with nearby individuals willing to lend money physically. Think of it like **Rapido/Ola/Uber — but for cash exchange**!

---

## 🚀 How It Works

- A **traveler** opens the app and requests a cash amount.
- **Nearby lenders** are notified instantly with details like amount, urgency, and distance.
- The **first lender to accept** the request is matched with the traveler.
- After a successful match:
  - Both users see **live tracking** and ETA on the map.
  - **Phone numbers** are revealed for in-person coordination.

---

## 🔑 Features

- 📍 **Live location matching** using geolocation
- 🏁 **First-accept-first-match** logic (like Ola/Uber)
- 🧭 **Live map & ETA tracking**
- 📞 **Contact sharing** after match
- 🔔 **Real-time notifications**
- 📊 **User dashboards** with borrower/lender stats
- 🔒 **Authentication & role-based access**

---

## 🛠️ Tech Stack

**Frontend**:
- React + TypeScript
- Tailwind CSS
- Vite

**Backend**:
- Node.js + Express
- MongoDB (Mongoose)
- Geospatial queries & Haversine formula

---

## 🧪 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Thanujananjappa/Cashconnect.git
cd Cashconnect
```
## 🧪 Setup Instructions

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```
3. Install Backend Dependencies
```bash

cd ../cashconnect-backend
npm install
```
4. Set Up Environment Variables
Create a .env file inside cashconnect-backend/:

```env

MONGODB_URI=your_mongodb_connection_string
PORT=5000
```
5. Run the App
Backend
```bash

cd cashconnect-backend
npm run dev
```
Frontend
```bash
cd ../frontend
npm run dev
```
Visit: http://localhost:5173

🧠 Future Improvements
✅ SMS/WhatsApp alerts on match

✅ OTP verification on cash exchange

✅ Transaction logging & lending history

✅ Ratings and trust score

👩‍💻 Author
Built with ❤️ by Thanuja Nanjappa
