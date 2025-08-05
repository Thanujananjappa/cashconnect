
 💸 CashConnect

CashConnect is a peer-to-peer (P2P) lending platform that connects borrowers and lenders based on location, loan terms, and matching logic. Built using the MERN stack (MongoDB, Express, React, Node.js), it features real-time loan matching, borrower-lender dashboards, live location tracking, and secure loan request flows.

## 📸 Screenshots

> Place your screenshots inside a `/screenshots` folder in the root directory. Example images:

| Dashboard View | Live Tracking | Loan Request Form |
|----------------|---------------|-------------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Live](./screenshots/live-tracking.png) | ![Form](./screenshots/loan-form.png) |

---

## 🚀 Features

- 🔐 User authentication (borrowers and lenders)
- 📍 Geolocation-based matching using Haversine formula
- 🧠 ML-inspired logic for nearest lender recommendations
- 💬 Loan request system with acceptance flow
- 📡 Real-time live tracking for accepted loans
- 📊 Dynamic dashboards for borrowers and lenders
- ⚙️ RESTful API built with Express.js

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Geolocation:** LocationIQ (Reverse Geocoding), Haversine logic
- **Other Tools:** Axios, React Router, Lucide Icons

---

## 📦 Installation and Setup

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/cashconnect.git
cd cashconnect
```
Install frontend dependencies:

```bash

cd frontend
npm install
```
Install backend dependencies:

```bash

cd ../backend
npm install
```
Set up environment variables:

Create a .env file in the backend/ directory with the following:

```env

PORT=5000
MONGO_URI=your_mongodb_connection_string
LOCATIONIQ_API_KEY=your_locationiq_api_key
```
Run the backend server:

```bash

cd backend
npm run dev
```
Run the frontend app:

```bash

cd frontend
npm run dev
```
Visit: http://localhost:5173 in your browser.

🧪 Sample Accounts (Optional for Testing)
Role	Email	Password
Borrower	thanujananjappa@example.com	12345678
Lender	rinu@example.com	12345678

📄 License
This project is licensed under the MIT License.

```vbnet

MIT License

Copyright (c) 2025 Thanuja

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell      
copies of the Software, and to permit persons to whom the Software is          
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in     
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR     
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,       
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE    
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER         
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN      
THE SOFTWARE.
🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
```
📫 Contact

Created by Thanuja Nanjappa – feel free to reach out!


