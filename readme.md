---
---

# 📦 Lead Distribution System – API Documentation

## Base URL

```
http://localhost:5000/api
```

---

# 1. Client Module

Manages clients (companies/teams) that can receive leads.

### Base Endpoint

```
/api/clients
```

### 1.1 Get All Clients

```http
GET /api/clients
```

**Response**

```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Client A",
    "company": "ABC Realty",
    "isActive": true,
    "totalLeadsReceived": 25,
    "createdAt": "2026-07-19T10:20:30.000Z",
    "updatedAt": "2026-07-19T10:20:30.000Z"
  }
]
```

### 1.2 Get Client by ID

```http
GET /api/clients/:id
```

**Response** – same as above for single client.

### 1.3 Create Client

```http
POST /api/clients
```

**Body**

```json
{
  "name": "Client A",
  "company": "ABC Realty",
  "isActive": true
}
```

**Response**

```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "_id": "...",
    "name": "Client A",
    "company": "ABC Realty",
    "isActive": true
  }
}
```

### 1.4 Update Client

```http
PUT /api/clients/:id
```

**Body** – any fields to update.

**Response**

```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": { ... }
}
```

### 1.5 Delete Client

```http
DELETE /api/clients/:id
```

**Response**

```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

---

### Client Object (Fields)

| Field                | Type     | Description                                     |
| -------------------- | -------- | ----------------------------------------------- |
| `_id`                | ObjectId | Unique identifier                               |
| `name`               | String   | Client name (required, unique)                  |
| `company`            | String   | Company or organisation name (optional)         |
| `isActive`           | Boolean  | Can this client receive leads? (default `true`) |
| `totalLeadsReceived` | Number   | Number of leads assigned so far                 |
| `createdAt`          | Date     | Creation timestamp                              |
| `updatedAt`          | Date     | Last update timestamp                           |

---

### Route Summary – Clients

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| GET    | `/api/clients`     | List all clients          |
| GET    | `/api/clients/:id` | Get a client by ID        |
| POST   | `/api/clients`     | Create a new client       |
| PUT    | `/api/clients/:id` | Update an existing client |
| DELETE | `/api/clients/:id` | Delete a client           |

---

# 2. Rule Module

Defines conditions to distribute leads to clients. Rules are evaluated by **priority** (lower number = higher priority).

### Base Endpoint

```
/api/rules
```

### 2.1 Get All Rules

```http
GET /api/rules
```

**Response**

```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0k1",
    "name": "Residential 2BHK Delhi",
    "clientId": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Client A"
    },
    "conditions": {
      "property": "Residential",
      "configuration": "2 BHK",
      "city": "Delhi",
      "minBudget": 300000,
      "maxBudget": 600000
    },
    "priority": 1,
    "isActive": true,
    "leadsAssigned": 15,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### 2.2 Get Rule by ID

```http
GET /api/rules/:id
```

### 2.3 Create Rule

```http
POST /api/rules
```

**Body**

```json
{
  "name": "Residential 2BHK Delhi",
  "clientId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "conditions": {
    "property": "Residential",
    "configuration": "2 BHK",
    "city": "Delhi",
    "minBudget": 300000,
    "maxBudget": 600000
  },
  "priority": 1,
  "isActive": true
}
```

**Response**

```json
{
  "success": true,
  "message": "Rule created successfully",
  "data": { "_id": "...", "name": "Residential 2BHK Delhi" }
}
```

### 2.4 Update Rule

```http
PUT /api/rules/:id
```

**Body** – any fields to update.

### 2.5 Delete Rule

```http
DELETE /api/rules/:id
```

---

### Rule Object (Fields)

| Field           | Type     | Description                                           |
| --------------- | -------- | ----------------------------------------------------- |
| `_id`           | ObjectId | Unique identifier                                     |
| `name`          | String   | Rule name (required)                                  |
| `clientId`      | ObjectId | Reference to the Client that will receive leads       |
| `conditions`    | Object   | Matching criteria (dynamic key–value pairs)           |
| `priority`      | Number   | Execution order – lower number = higher priority      |
| `isActive`      | Boolean  | Is the rule active? (default `true`)                  |
| `leadsAssigned` | Number   | Number of leads assigned via this rule (auto-updated) |
| `createdAt`     | Date     | Timestamp                                             |
| `updatedAt`     | Date     | Timestamp                                             |

### Supported Condition Keys

The `conditions` object is flexible. Common keys:

| Key             | Description                       |
| --------------- | --------------------------------- |
| `property`      | Property type (e.g., Residential) |
| `configuration` | Configuration (e.g., 2 BHK)       |
| `city`          | City name                         |
| `minBudget`     | Minimum budget (number)           |
| `maxBudget`     | Maximum budget (number)           |
| `source`        | Lead source (facebook, google …)  |

> **Matching Logic**: All conditions must match exactly (case‑sensitive for strings). Budget range is inclusive.

---

### Route Summary – Rules

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/rules`     | List all rules          |
| GET    | `/api/rules/:id` | Get a rule by ID        |
| POST   | `/api/rules`     | Create a new rule       |
| PUT    | `/api/rules/:id` | Update an existing rule |
| DELETE | `/api/rules/:id` | Delete a rule           |

---

# 3. Lead Module

Receives incoming leads, normalises them, matches against rules, assigns to a client, and stores the lead.

### Base Endpoint

```
/api/leads
```

### 3.1 Submit a New Lead

```http
POST /api/leads
```

**Request Body**

```json
{
  "source": "facebook",
  "data": {
    "full_name": "Rahul Sharma",
    "phone_number": "9999999999",
    "email": "rahul@email.com",
    "property_type": "Residential",
    "bhk_type": "2 BHK",
    "city_name": "Delhi",
    "budget": 500000
  }
}
```

**Supported Sources & Field Mappings**

The server automatically maps the raw `data` fields to the internal system fields (`name`, `phone`, `email`, `property`, `configuration`, `city`, `budget`) using the following mappings:

| Source    | name            | phone            | email           | property            | configuration        | city        | budget         |
| --------- | --------------- | ---------------- | --------------- | ------------------- | -------------------- | ----------- | -------------- |
| facebook  | `full_name`     | `phone_number`   | `email`         | `property_type`     | `bhk_type`           | `city_name` | `budget`       |
| google    | `full_name`     | `mobile`         | `email_address` | `property_category` | `configuration_type` | `city`      | `budget_range` |
| instagram | `customer_name` | `contact_number` | `email_id`      | `property_category` | `property_type`      | `city_name` | `budget`       |
| website   | `name`          | `phone`          | `email`         | `property`          | `configuration`      | `city`      | `budget`       |
| excel     | (custom)        | (custom)         | (custom)        | (custom)            | (custom)             | (custom)    | (custom)       |
| other     | (custom)        | (custom)         | (custom)        | (custom)            | (custom)             | (custom)    | (custom)       |

> For custom sources (`excel`, `other`), you must send the data in system fields directly or provide additional mapping.

**Success Response**

```json
{
  "success": true,
  "leadId": "65f1a2b3c4d5e6f7g8h9i0m1",
  "assignedTo": "Client A",
  "rule": "Residential 2BHK Delhi",
  "processingTime": 18,
  "status": "assigned"
}
```

**If No Rule Matches**

```json
{
  "success": true,
  "leadId": "65f1a2b3c4d5e6f7g8h9i0m1",
  "assignedTo": null,
  "rule": null,
  "status": "pending",
  "message": "No matching rule found – lead is pending."
}
```

### 3.2 Get All Leads

```http
GET /api/leads
```

**Response** – array of leads (populated with client/rule details).

### 3.3 Get Lead by ID

```http
GET /api/leads/:id
```

**Response**

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0m1",
  "source": "facebook",
  "rawData": { "full_name": "Rahul Sharma", "phone_number": "9999999999" },
  "mappedData": {
    "name": "Rahul Sharma",
    "phone": "9999999999",
    "property": "Residential",
    "configuration": "2 BHK",
    "city": "Delhi",
    "budget": 500000
  },
  "assignedTo": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Client A"
  },
  "rule": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0k1",
    "name": "Residential 2BHK Delhi"
  },
  "status": "assigned",
  "remarks": "Lead assigned successfully",
  "createdAt": "2026-07-19T12:30:00.000Z",
  "updatedAt": "2026-07-19T12:30:00.000Z"
}
```

---

### Lead Object (Fields)

| Field        | Type     | Description                                            |
| ------------ | -------- | ------------------------------------------------------ |
| `_id`        | ObjectId | Unique identifier                                      |
| `source`     | String   | Source of the lead (enum: facebook, google, …)         |
| `rawData`    | Object   | Original payload from the source                       |
| `mappedData` | Object   | Normalised internal data (after mapping)               |
| `assignedTo` | ObjectId | Reference to the Client (if assigned)                  |
| `rule`       | ObjectId | Reference to the Rule that matched (if any)            |
| `status`     | String   | One of: `pending`, `assigned`, `processed`, `rejected` |
| `remarks`    | String   | Additional processing notes (e.g., error description)  |
| `createdAt`  | Date     | Timestamp                                              |
| `updatedAt`  | Date     | Timestamp                                              |

---

### Route Summary – Leads

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/api/leads`     | Submit a new lead       |
| GET    | `/api/leads`     | List all leads          |
| GET    | `/api/leads/:id` | Get a single lead by ID |

---

# 4. Reports Module

Provides aggregated statistics for dashboards and monitoring.

### Base Endpoint

```
/api/reports
```

### 4.1 Dashboard Statistics

```http
GET /api/reports/dashboard
```

**Response**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalLeads": 150,
      "totalClients": 3,
      "totalRules": 4,
      "activeRules": 4
    },
    "leadStatus": {
      "assigned": 145,
      "pending": 3,
      "rejected": 2
    },
    "sourceDistribution": [
      { "source": "facebook", "count": 60 },
      { "source": "google", "count": 40 },
      { "source": "instagram", "count": 30 },
      { "source": "website", "count": 20 }
    ],
    "clientDistribution": [
      { "client": "Client A", "leadsAssigned": 70 },
      { "client": "Client B", "leadsAssigned": 45 },
      { "client": "Client C", "leadsAssigned": 30 }
    ],
    "ruleDistribution": [
      { "rule": "Residential 2BHK Delhi", "leadsAssigned": 40 },
      { "rule": "Commercial Office Noida", "leadsAssigned": 35 },
      { "rule": "Default Rule", "leadsAssigned": 40 }
    ]
  }
}
```

---

### Route Summary – Reports

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/api/reports/dashboard` | Get dashboard summary statistics |

---

# 🧭 Lead Processing Flow

```
Incoming Lead (POST /api/leads)
       │
       ▼
Extract source & raw data
       │
       ▼
Map raw fields → system fields (mappedData)
       │
       ▼
Fetch all active rules (sorted by priority)
       │
       ▼
Find first rule whose conditions match mappedData
       │
       ▼
If found → assign lead to rule.clientId
       │
       ▼
Update lead status to "assigned", store rule & client
       │
       ▼
Increment rule.leadsAssigned & client.totalLeadsReceived
       │
       ▼
Return response with assignment details
       │
       ▼
(If no rule matches → lead remains "pending")
```

---

4. Reports Module (Updated)
   4.1 Dashboard Statistics
   http
   GET /api/reports/dashboard
   Response

json
{
"success": true,
"data": {
"summary": {
"total": 150,
"pending": 3,
"assigned": 145,
"processed": 0,
"rejected": 2
},
"sourceDistribution": [
{ "_id": "facebook", "count": 60 },
{ "_id": "google", "count": 40 },
{ "_id": "instagram", "count": 30 },
{ "_id": "website", "count": 20 }
],
"clientDistribution": [
{
"clientId": "65f1a2b3...",
"name": "Client A",
"company": "ABC Realty",
"count": 70
},
{
"clientId": "65f1a2b3...",
"name": "Client B",
"company": "XYZ Developers",
"count": 45
}
],
"recentLeads": [
{
"_id": "65f1a2b3...",
"source": "facebook",
"assignedTo": { "name": "Client A", "company": "ABC Realty" },
"rule": { "name": "Residential 2BHK Delhi" },
"status": "assigned",
"createdAt": "2026-07-19T12:30:00.000Z"
}
// ... maximum 10 recent leads
]
}
}
Fields Explanation
Key Description
summary Lead count grouped by status (total, pending, assigned, processed, rejected)
sourceDistribution Lead count grouped by source (sorted descending)
clientDistribution Lead count grouped by assigned client (includes client details and count)
recentLeads Last 10 leads with populated assignedTo and rule fields
Route Summary (Updated)
Method Endpoint Description
GET /api/reports/dashboard Retrieve dashboard analytics and summary statistics (including recent leads)
