# 🧪 QA Automation Portfolio

> **By:** Sarmad  
> **Skills:** API Testing · Playwright E2E · REST API Automation · Postman  
> **Status:** Actively seeking remote QA/SDET roles

---

## 📁 Repository Structure

```
qa-portfolio/
├── postman/
│   └── User_API_Collection.postman_collection.json   # Full CRUD API test suite
├── playwright/
│   ├── playwright.config.js                           # Multi-browser config
│   └── tests/
│       └── login.spec.js                             # E2E login test suite (10 TCs)
├── rest-api/
│   └── api.test.js                                   # Node.js REST API test suite
└── README.md
```

---

## 🔧 Projects

### 1. Postman API Collection
**File:** `postman/User_API_Collection.postman_collection.json`  
**Target API:** [ReqRes](https://reqres.in) — a free, public REST API

**What it demonstrates:**
- ✅ GET, POST, PUT, DELETE request coverage
- ✅ JavaScript test assertions on status codes, response body, and schema
- ✅ Chained requests using collection variables (saves userId from GET → uses in DELETE)
- ✅ Negative test case (registration without password → expect 400 + error message)
- ✅ Response time assertions (< 2000ms)

**How to run:**
1. Import the `.json` file into [Postman](https://postman.com)
2. Click **Run Collection**
3. All 6 requests will execute with automated assertions

---

### 2. Playwright E2E Test Suite
**File:** `playwright/tests/login.spec.js`  
**Target:** [practice.expandtesting.com](https://practice.expandtesting.com)

**What it demonstrates:**
- ✅ Page Object Model (POM) design pattern
- ✅ 10 test cases across 3 suites (Login, Navigation, Form Validation)
- ✅ Positive & negative login tests
- ✅ Mobile viewport testing (iPhone 14 simulation)
- ✅ Keyboard navigation testing
- ✅ Screenshots captured as evidence artifacts

**Test Cases:**

| ID | Title | Type |
|----|-------|------|
| TC001 | Successful login | Positive |
| TC002 | Login with wrong password | Negative |
| TC003 | Login with empty fields | Negative |
| TC004 | Logout after login | Positive |
| TC005 | Page elements visible | UI |
| TC006 | Password field is masked | Security |
| TC007 | Mobile viewport responsive | Responsive |
| TC008 | Username accepts text | Input |
| TC009 | Tab key navigation | Accessibility |
| TC010 | Screenshot evidence | Documentation |

**How to run:**
```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

---

### 3. REST API Test Suite (Node.js)
**File:** `rest-api/api.test.js`  
**Target API:** [ReqRes](https://reqres.in)

**What it demonstrates:**
- ✅ 10 test suites, 30+ individual assertions
- ✅ Full CRUD coverage (GET, POST, PUT, PATCH, DELETE)
- ✅ Schema validation (field presence, types, formats)
- ✅ Negative tests (missing password, wrong credentials)
- ✅ Response time measurement
- ✅ Chained requests (create user → update → delete)
- ✅ Delayed response handling

**How to run:**
```bash
node rest-api/api.test.js
```

Sample output:
```
============================================================
  REST API TEST SUITE — My Portfolio
  Target: https://reqres.in/api
============================================================

📋 Suite 1: GET Users
  ✅ PASS: Status is 200
  ✅ PASS: Response time < 2000ms
  ✅ PASS: Response has data array
  ...

============================================================
  TEST RESULTS: 32 passed, 0 failed
============================================================
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Postman | API testing & collection runner |
| Playwright | Browser automation & E2E testing |
| Node.js | REST API test runner |
| JavaScript | Test scripting language |

---

## 📜 Certifications

- 🏆 ISTQB Foundation Level (CTFL) — In Progress

---

## 📬 Contact

- **LinkedIn:** https://www.linkedin.com/in/sarmad-hassan-21342b158/
- **Email:** sarmadsqa@gmail.com
- **GitHub:** https://github.com/maddyqa21/qa-automation-portfolio.git

---

*This portfolio is built against free, publicly available practice APIs and test environments. All tests are runnable without any paid accounts.*
