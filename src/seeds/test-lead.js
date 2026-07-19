import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

async function sendLead(lead) {
  try {
    const { data } = await axios.post(`${BASE_URL}/leads`, lead);

    console.log(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

async function runTests() {
  console.log("\n========== TEST 1 ==========");

  await sendLead({
    source: "facebook",
    data: {
      full_name: "Rahul Sharma",
      phone_number: "9999999999",
      email: "rahul@email.com",

      property_type: "Residential",
      bhk_type: "2 BHK",
      city_name: "Delhi",

      budget: 500000,
    },
  });

  console.log("\n========== TEST 2 ==========");

  await sendLead({
    source: "google",
    data: {
      full_name: "Aman Verma",
      mobile: "8888888888",
      email_address: "aman@email.com",

      property_category: "Commercial",
      configuration_type: "Office",
      city: "Noida",

      budget_range: 1000000,
    },
  });

  console.log("\n========== TEST 3 ==========");

  await sendLead({
    source: "instagram",
    data: {
      customer_name: "Mohit Singh",
      contact_number: "7777777777",
      email_id: "mohit@email.com",

      property_category: "Residential",
      property_type: "3 BHK",
      city_name: "Gurgaon",

      budget: 700000,
    },
  });

  console.log("\n========== TEST 4 ==========");

  await sendLead({
    source: "website",
    data: {
      name: "Unknown User",
      phone: "6666666666",
      email: "unknown@email.com",

      property: "Residential",
      configuration: "4 BHK",
      city: "Mumbai",

      budget: 900000,
    },
  });
}

runTests();
