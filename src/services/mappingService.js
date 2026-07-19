class MappingService {
  mapLeadData(rawData, source) {
    return this._mapSourceToSystem(rawData, source);
  }

  _mapSourceToSystem(rawData, source) {
    const sourceMappings = {
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
    };

    const defaultMapping = {
      name: "name",
      phone: "phone",
      email: "email",

      property: "property",
      configuration: "configuration",
      city: "city",
      budget: "budget",
    };

    const mapping = sourceMappings[source] || defaultMapping;

    const mapped = {};

    for (const [systemField, sourceField] of Object.entries(mapping)) {
      if (
        rawData[sourceField] !== undefined &&
        rawData[sourceField] !== null &&
        rawData[sourceField] !== ""
      ) {
        mapped[systemField] = rawData[sourceField];
      }
    }

    return mapped;
  }

  validateRequiredFields(data) {
    const required = ["name", "phone"];

    const missing = required.filter(
      (field) => !data[field] || String(data[field]).trim() === "",
    );

    return {
      isValid: missing.length === 0,
      missingFields: missing,
    };
  }

  getSystemFields() {
    return [
      "name",
      "phone",
      "email",
      "property",
      "configuration",
      "city",
      "budget",
    ];
  }
}

export default new MappingService();
