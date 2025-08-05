# 💸 CashConnect – Peer-to-Peer Lending Platform

A real-time loan matchmaking platform that connects **borrowers** and **lenders** based on **geolocation**, **loan requirements**, and **matching logic**. The system includes borrower/lender dashboards, request management, and live location tracking after loan acceptance.

---

## 🌐 Deployment URLs

* Frontend: (https://cashconnect-cnkd-7wlx13nqp-thanujananjappas-projects.vercel.app)
* Backend: render
---

## 📸 Screenshots

### Borrower Dashboard

![Borrower Dashboard](./screenshots/borrower-dashboard.png)  
See nearby lenders and request a loan

### Lender Dashboard

![Lender Dashboard](./screenshots/lender-dashboard.png)  
View pending loan requests and accept

### Loan Request Form

![Loan Form](./screenshots/loan-form.png)  
Submit loan request with calculated charges

### Live Tracking

![Live Map](./screenshots/live-tracking.png)  
Track real-time location of borrower/lender

> Make sure you place all screenshots in a `screenshots` folder in your root directory.

---

## 🌟 Features

* 🔐 **User Authentication** – Register/login as borrower or lender
* 📍 **Location-Based Matching** – Find nearest lenders using Haversine formula
* 💰 **Loan Request Flow** – Borrowers send requests; lenders accept
* 📡 **Live Location Tracking** – Ola/Rapido-style tracking post-acceptance
* 📊 **Separate Dashboards** – For both borrowers and lenders
* 💸 **Automatic Charges Calculation** – Processing fees auto-added
* 📬 **Notifications** – Get notified when loan requests are accepted
* ⚡ **Responsive UI** – Built with Tailwind CSS

---

## 🛠 Tech Stack

### 🖥 Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router DOM

### 🌐 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Haversine formula for geo-distance
* LocationIQ API for reverse geocoding

---

## 🚀 Getting Started

### 📋 Prerequisites

* Node.js (v14+)
* MongoDB (local or Atlas)
* LocationIQ API Key

---

### 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/cashconnect.git
cd cashconnect
```
Frontend Setup

```bash

cd frontend
npm install
npm run dev
```
Backend Setup

```bash

cd backend
npm install
node server.js
```
Environment Variables

Create .env file inside backend/:

```env

PORT=5000
MONGO_URI=your_mongodb_connection_string
LOCATIONIQ_API_KEY=your_locationiq_key
FRONTEND_URL=http://localhost:5173
```

###📱 Usage
##Borrower Flow

Sign up as a borrower

Submit loan request (with amount, term, purpose)

System auto-calculates processing charges

View live updates when a lender accepts your request

##Lender Flow

Sign up as a lender

See loan requests nearby

Accept any one request (first-come-first-serve logic)

After accepting, access live location of borrower

##Live Map

Integrated Leaflet map displays real-time tracking of borrower/lender

###📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


###👥 Author
Thanuja Nanjappa – Developer & Maintainer

###🙏 Acknowledgments
LocationIQ for reverse geocoding

Open source contributors of Haversine and Leaflet.js

MongoDB + Vite + Tailwind community

###📚 API Documentation
📌 Create Loan Request
```h

POST /api/loans
Content-Type: application/json

{
  "amount": 5000,
  "term": "6 months",
  "purpose": "Medical emergency",
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```
Response:

```json

{
  "message": "Loan created successfully",
  "loan": {
    "_id": "...",
    "finalAmount": 5250
  }
}
```
📌 Get Nearby Lenders (for borrower)
```h

GET /api/loans/matches?userId=USER_ID
```
Response:

```json

[
  {
    "lenderId": "1234",
    "distance": "2.4 km",
    "phone": "XXXXXXXXXX"
  }
]
```
📌 Accept Loan Request (by lender)
```h

POST /api/loans/accept
```
Content-Type: application/json
```json
{
  "loanId": "abc123",
  "lenderId": "lender_user_id"
}
```
📌 Get Live Tracking Info
```h

GET /api/loans/live-location?loanId=abc123
```
📎 Folder Structure
```css

cashconnect/
├── frontend/
│   └── src/
│       └── components/
│       └── pages/
│       └── hooks/
├── backend/
│   └── controllers/
│   └── models/
│   └── routes/
│   └── utils/
└── screenshots/
```



Ask ChatGPT
