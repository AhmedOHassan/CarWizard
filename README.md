# 🧙‍♂️ CarWizard AI - Your Personal Car Mechanic Assistant

CarWizard is an intelligent, AI-powered chatbot that helps diagnose common car issues and provides step-by-step troubleshooting guidance. Users can simply describe their car problem along with the make, model, and year, and CarWizard will return:

- A likely diagnosis
- Troubleshooting steps
- Recommended replacement parts (with shopping links)
- Relevant YouTube video tutorials for DIY repairs

---

## Why CarWizard?

Car repairs can be confusing and expensive. CarWizard gives car owners a simple and friendly way to understand their vehicle issues without needing to visit a mechanic right away. It’s ideal for:
- DIY enthusiasts looking to fix problems on their own
- Budget-conscious drivers who want to understand repair options
- Car owners looking for part suggestions and repair tutorials

---

## Features

- Collects user input for car make, model, year, and issue
- Uses **Google Gemini 2.0 Flash** to generate:
  - Diagnosis
  - Troubleshooting steps
  - Replacement parts
  - Relevant YouTube search terms
- Uses **SerpAPI** to fetch:
  - Product links (Amazon, AutoZone, Advance Auto Parts)
  - YouTube video tutorials
- Returns clean, formatted results for user display

---

## Technologies Used

**Frontend**
- React
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**AI Service**
- Google Gemini 2.0 Flash

**Search API**
- SerpAPI (Google Search Results API)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CarWizard.git
cd CarWizard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the server folder and add your keys:

```
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_KEY=your_serpapi_key
```

### 4. Start the Server
```bash
node server.js
```

### 5. Start the Website
```bash
npm run dev
```

---

## Future Ideas

- Chat session history and user login
- Smart image upload for visual diagnosis