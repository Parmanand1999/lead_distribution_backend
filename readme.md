# Client API Documentation

The Client module is used to manage all clients who can receive leads through the Lead Distribution System. Each client represents a company or organization that can be assigned leads based on matching distribution rules.

## Base URL

```text
http://localhost:5000/api/clients
```

---

# Endpoints

## 1. Get All Clients

**Request**

```http
GET /api/clients
```

### Description

Returns a list of all registered clients.

### Success Response

```json
[
  {
    "_id": "687b1234567890abcdef1234",
    "name": "Client A",
    "company": "ABC Realty",
    "isActive": true,
    "totalLeadsReceived": 25,
    "createdAt": "2026-07-19T10:20:30.000Z",
    "updatedAt": "2026-07-19T10:20:30.000Z"
  }
]
```

---

## 2. Get Client By ID

**Request**

```http
GET /api/clients/:id
```

### Example

```http
GET /api/clients/687b1234567890abcdef1234
```

### Success Response

```json
{
  "_id": "687b1234567890abcdef1234",
  "name": "Client A",
  "company": "ABC Realty",
  "isActive": true,
  "totalLeadsReceived": 25,
  "createdAt": "2026-07-19T10:20:30.000Z",
  "updatedAt": "2026-07-19T10:20:30.000Z"
}
```

---

## 3. Create Client

**Request**

```http
POST /api/clients
```

### Request Body

```json
{
  "name": "Client A",
  "company": "ABC Realty",
  "isActive": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "_id": "687b1234567890abcdef1234",
    "name": "Client A",
    "company": "ABC Realty",
    "isActive": true
  }
}
```

---

## 4. Update Client

**Request**

```http
PUT /api/clients/:id
```

### Example

```http
PUT /api/clients/687b1234567890abcdef1234
```

### Request Body

```json
{
  "company": "ABC Realty Pvt Ltd",
  "isActive": false
}
```

### Success Response

```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "_id": "687b1234567890abcdef1234",
    "name": "Client A",
    "company": "ABC Realty Pvt Ltd",
    "isActive": false
  }
}
```

---

## 5. Delete Client

**Request**

```http
DELETE /api/clients/:id
```

### Example

```http
DELETE /api/clients/687b1234567890abcdef1234
```

### Success Response

```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

---

# Client Object

| Field              | Type    | Description                                    |
| ------------------ | ------- | ---------------------------------------------- |
| name               | String  | Unique client name                             |
| company            | String  | Company or organization name                   |
| isActive           | Boolean | Indicates whether the client can receive leads |
| totalLeadsReceived | Number  | Total number of assigned leads                 |
| createdAt          | Date    | Record creation timestamp                      |
| updatedAt          | Date    | Last update timestamp                          |

---

# Route Summary

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| GET    | `/api/clients`     | Retrieve all clients      |
| GET    | `/api/clients/:id` | Retrieve a client by ID   |
| POST   | `/api/clients`     | Create a new client       |
| PUT    | `/api/clients/:id` | Update an existing client |
| DELETE | `/api/clients/:id` | Delete a client           |

# Rule API Documentation

The Rule module defines the conditions used to distribute incoming leads to the appropriate client. Each rule contains matching criteria such as property type, configuration, city, and budget range. Rules are evaluated in ascending order of priority (lower number = higher priority).

## Base URL

```text
http://localhost:5000/api/rules
```

---

# Endpoints

## 1. Get All Rules

**Request**

```http
GET /api/rules
```

### Description

Returns a list of all lead distribution rules.

### Success Response

```json
[
  {
    "_id": "687b1234567890abcdef1111",
    "name": "Residential 2BHK Delhi",
    "clientId": {
      "_id": "687b1234567890abcdef2222",
      "name": "Client A",
      "company": "ABC Realty"
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
    "leadsAssigned": 15
  }
]
```

---

## 2. Get Rule By ID

**Request**

```http
GET /api/rules/:id
```

### Example

```http
GET /api/rules/687b1234567890abcdef1111
```

### Success Response

```json
{
  "_id": "687b1234567890abcdef1111",
  "name": "Residential 2BHK Delhi",
  "clientId": {
    "_id": "687b1234567890abcdef2222",
    "name": "Client A",
    "company": "ABC Realty"
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
  "leadsAssigned": 15
}
```

---

## 3. Create Rule

**Request**

```http
POST /api/rules
```

### Request Body

```json
{
  "name": "Residential 2BHK Delhi",
  "clientId": "687b1234567890abcdef2222",
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

### Success Response

```json
{
  "success": true,
  "message": "Rule created successfully",
  "data": {
    "_id": "687b1234567890abcdef1111",
    "name": "Residential 2BHK Delhi"
  }
}
```

---

## 4. Update Rule

**Request**

```http
PUT /api/rules/:id
```

### Example

```http
PUT /api/rules/687b1234567890abcdef1111
```

### Request Body

```json
{
  "priority": 2,
  "isActive": false
}
```

### Success Response

```json
{
  "success": true,
  "message": "Rule updated successfully",
  "data": {
    "_id": "687b1234567890abcdef1111",
    "priority": 2,
    "isActive": false
  }
}
```

---

## 5. Delete Rule

**Request**

```http
DELETE /api/rules/:id
```

### Example

```http
DELETE /api/rules/687b1234567890abcdef1111
```

### Success Response

```json
{
  "success": true,
  "message": "Rule deleted successfully"
}
```

---

# Rule Object

| Field         | Type     | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| name          | String   | Rule name                                                |
| clientId      | ObjectId | Client assigned to this rule                             |
| conditions    | Object   | Matching criteria for lead assignment                    |
| priority      | Number   | Rule execution priority (lower number = higher priority) |
| isActive      | Boolean  | Indicates whether the rule is active                     |
| leadsAssigned | Number   | Total leads assigned through this rule                   |
| createdAt     | Date     | Record creation timestamp                                |
| updatedAt     | Date     | Last update timestamp                                    |

---

# Supported Rule Conditions

The `conditions` object supports dynamic matching fields.

| Field         | Description                                   |
| ------------- | --------------------------------------------- |
| property      | Property type (e.g., Residential, Commercial) |
| configuration | Property configuration (e.g., 2 BHK, Office)  |
| city          | Lead city                                     |
| minBudget     | Minimum budget required                       |
| maxBudget     | Maximum budget allowed                        |

---

# Rule Matching Logic

Rules are evaluated in ascending order of priority.

A rule matches when:

- All string fields (`property`, `configuration`, `city`) match exactly (case-insensitive).
- The lead budget is greater than or equal to `minBudget`.
- The lead budget is less than or equal to `maxBudget`.
- The first matching rule is selected, and no further rules are evaluated.
- If no rule matches, a fallback rule (if configured) can be used.

---

# Route Summary

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/rules`     | Retrieve all rules      |
| GET    | `/api/rules/:id` | Retrieve a rule by ID   |
| POST   | `/api/rules`     | Create a new rule       |
| PUT    | `/api/rules/:id` | Update an existing rule |
| DELETE | `/api/rules/:id` | Delete a rule           |

# Lead API Documentation

The Lead module is responsible for receiving leads from multiple sources, normalizing the incoming data, matching the lead against active distribution rules, assigning it to the appropriate client, and storing the lead for future reporting.

## Base URL

```text
http://localhost:5000/api/leads
```

---

# Endpoints

## 1. Submit New Lead

**Request**

```http
POST /api/leads
```

### Description

Receives a new lead from any supported source and automatically:

- Normalizes the incoming data
- Matches the lead against active rules
- Assigns the lead to the first matching client
- Stores the lead in the database

### Request Body (Facebook Example)

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

### All Source Data

```object
{
      facebook: {
        name: "full_name",
        phone: "phone_number",
        email: "email",

        property: "property_type",
        configuration: "bhk_type",
        city: "city_name",
        budget: "budget",
      },

      google: {
        name: "full_name",
        phone: "mobile",
        email: "email_address",

        property: "property_category",
        configuration: "configuration_type",
        city: "city",
        budget: "budget_range",
      },

      instagram: {
        name: "customer_name",
        phone: "contact_number",
        email: "email_id",

        property: "property_category",
        configuration: "property_type",
        city: "city_name",
        budget: "budget",
      },

      website: {
        name: "name",
        phone: "phone",
        email: "email",

        property: "property",
        configuration: "configuration",
        city: "city",
        budget: "budget",
      },
    }
```

### Success Response

```json
{
  "success": true,
  "leadId": "687b1234567890abcdef1234",
  "assignedTo": "Client A",
  "rule": "Residential 2BHK Delhi",
  "processingTime": 18
}
```

---

## 2. Get All Leads

**Request**

```http
GET /api/leads
```

### Description

Returns all stored leads. This endpoint may also support filtering and pagination if implemented.

### Success Response

```json
[
  {
    "_id": "687b1234567890abcdef1234",
    "source": "facebook",
    "clientId": {
      "_id": "687b1234567890abcdef1111",
      "name": "Client A"
    },
    "ruleId": {
      "_id": "687b1234567890abcdef2222",
      "name": "Residential 2BHK Delhi"
    },
    "status": "assigned",
    "createdAt": "2026-07-19T12:30:00.000Z"
  }
]
```

---

## 3. Get Lead By ID

**Request**

```http
GET /api/leads/:id
```

### Example

```http
GET /api/leads/687b1234567890abcdef1234
```

### Success Response

```json
{
  "_id": "687b1234567890abcdef1234",
  "source": "facebook",
  "rawData": {
    "full_name": "Rahul Sharma",
    "phone_number": "9999999999"
  },
  "clientId": {
    "_id": "687b1234567890abcdef1111",
    "name": "Client A",
    "company": "ABC Realty"
  },
  "ruleId": {
    "_id": "687b1234567890abcdef2222",
    "name": "Residential 2BHK Delhi"
  },
  "status": "assigned",
  "remarks": "Lead assigned successfully",
  "createdAt": "2026-07-19T12:30:00.000Z",
  "updatedAt": "2026-07-19T12:30:00.000Z"
}
```

---

# Supported Lead Sources

| Source    | Description          |
| --------- | -------------------- |
| facebook  | Facebook Lead Ads    |
| google    | Google Lead Form     |
| instagram | Instagram Lead Ads   |
| website   | Website Contact Form |
| excel     | Bulk Excel Upload    |
| other     | Any custom source    |

---

# Lead Processing Flow

```text
Incoming Lead
      │
      ▼
Receive API Request
      │
      ▼
Normalize Source Fields
      │
      ▼
Rule Matching Engine
      │
      ▼
Client Assignment
      │
      ▼
Save Lead
      │
      ▼
Return Response
```

---

# Lead Object

| Field     | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| source    | String   | Source from which the lead was received |
| rawData   | Object   | Original lead payload                   |
| clientId  | ObjectId | Assigned client                         |
| ruleId    | ObjectId | Matched rule                            |
| status    | String   | Lead status                             |
| remarks   | String   | Processing remarks                      |
| createdAt | Date     | Lead creation timestamp                 |
| updatedAt | Date     | Last update timestamp                   |

---

# Route Summary

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/api/leads`     | Submit a new lead     |
| GET    | `/api/leads`     | Retrieve all leads    |
| GET    | `/api/leads/:id` | Retrieve a lead by ID |

# Reports API Documentation

The Reports module provides aggregated statistics for the Lead Distribution System. It is primarily used to display dashboard metrics such as total leads, lead status distribution, source-wise analytics, client-wise assignments, and rule performance.

## Base URL

```text
http://localhost:5000/api/reports
```

---

# Endpoints

## 1. Dashboard Statistics

**Request**

```http
GET /api/reports/dashboard
```

### Description

Returns overall dashboard statistics for the lead distribution system.

Typical metrics include:

- Total leads
- Total clients
- Total active rules
- Lead status summary
- Source-wise lead distribution
- Client-wise lead assignment
- Rule-wise assignment statistics

---

### Success Response

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
      {
        "source": "facebook",
        "count": 60
      },
      {
        "source": "google",
        "count": 40
      },
      {
        "source": "instagram",
        "count": 30
      },
      {
        "source": "website",
        "count": 20
      }
    ],
    "clientDistribution": [
      {
        "client": "Client A",
        "leadsAssigned": 70
      },
      {
        "client": "Client B",
        "leadsAssigned": 45
      },
      {
        "client": "Client C",
        "leadsAssigned": 30
      }
    ],
    "ruleDistribution": [
      {
        "rule": "Residential 2BHK Delhi",
        "leadsAssigned": 40
      },
      {
        "rule": "Commercial Office Noida",
        "leadsAssigned": 35
      },
      {
        "rule": "Residential 3BHK Gurgaon",
        "leadsAssigned": 30
      },
      {
        "rule": "Default Rule",
        "leadsAssigned": 40
      }
    ]
  }
}
```

---

# Dashboard Metrics

| Metric             | Description                           |
| ------------------ | ------------------------------------- |
| totalLeads         | Total number of leads received        |
| totalClients       | Total registered clients              |
| totalRules         | Total configured rules                |
| activeRules        | Number of active rules                |
| leadStatus         | Lead count grouped by status          |
| sourceDistribution | Lead count grouped by source          |
| clientDistribution | Lead count grouped by assigned client |
| ruleDistribution   | Lead count grouped by matched rule    |

---

# Dashboard Analytics

The dashboard helps monitor the overall health of the Lead Distribution System by providing:

- Overall lead statistics
- Source-wise lead trends
- Client performance
- Rule performance
- Lead assignment summary
- Pending and rejected lead tracking

---

# Route Summary

| Method | Endpoint                 | Description                                         |
| ------ | ------------------------ | --------------------------------------------------- |
| GET    | `/api/reports/dashboard` | Retrieve dashboard analytics and summary statistics |
