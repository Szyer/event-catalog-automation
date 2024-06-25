const fs = require('fs');
const { faker } = require('@faker-js/faker');

// Read the JSON data from a file
const data = JSON.parse(fs.readFileSync('../json/orignalPayload.json', 'utf8'));

// Function to anonymize personal information in an event
function anonymizeEvent(event) {
  if (event.payload) {
    if (event.payload.username) {
      event.payload.username = faker.internet.userName();
    }
    if (event.payload.userName) {
      event.payload.userName = faker.internet.userName();
    }
    if (event.payload.zipcode) {
      event.payload.zipcode = faker.address.zipCode();
    }
    if (event.payload.visitList) {
      event.payload.visitList.forEach(visit => {
        if (visit.employeeLastName) {
          visit.employeeLastName = faker.name.lastName();
        }
        if (visit.employeeFirstName) {
          visit.employeeFirstName = faker.name.firstName();
        }
        if (visit.employeeUserName) {
          visit.employeeUserName = faker.internet.userName();
        }
        if (visit.patientFirstName) {
          visit.patientFirstName = faker.name.firstName();
        }
        if (visit.patientLastName) {
          visit.patientLastName = faker.name.lastName();
        }
        if (visit.serviceLocation) {
          if (visit.serviceLocation.zipcode) {
            visit.serviceLocation.zipcode = faker.address.zipCode();
          }
          if (visit.serviceLocation.city) {
            visit.serviceLocation.city = faker.address.city();
          }
          if (visit.serviceLocation.serviceAddress) {
            visit.serviceLocation.serviceAddress = faker.address.streetAddress();
          }
          if (visit.serviceLocation.location) {
            if (visit.serviceLocation.location.longitude) {
              visit.serviceLocation.location.longitude = faker.address.longitude();
            }
            if (visit.serviceLocation.location.latitude) {
              visit.serviceLocation.location.latitude = faker.address.latitude();
            }
          }
        }
      });
    }
  }

  if (event.callerName) {
    event.callerName = faker.name.findName();
  }
  if (event.callerPhoneNo) {
    event.callerPhoneNo = faker.phone.number();
  }
  if (event.receivedByUsername) {
    event.receivedByUsername = faker.internet.userName();
  }
  if (event.receivedBy) {
    event.receivedBy = `${faker.name.lastName()},${faker.name.firstName()}${faker.random.alpha(1).toUpperCase()}.`;
  }
  if (event.metadata) {
    if (event.metadata.location) {
      if (event.metadata.location.longitude) {
        event.metadata.location.longitude = faker.address.longitude();
      }
      if (event.metadata.location.latitude) {
        event.metadata.location.latitude = faker.address.latitude();
      }
      if (event.metadata.location.zipcode) {
        event.metadata.location.zipcode = faker.address.zipCode();
      }
    }
    if (event.metadata.firstname) {
      event.metadata.firstname = faker.name.firstName();
    }
    if (event.metadata.lastname) {
      event.metadata.lastname = faker.name.lastName();
    }
    if (event.metadata.dateOfBirth) {
      event.metadata.dateOfBirth = faker.date.past(85).toISOString().split('T')[0];
    }
    if (event.metadata.mR_Number) {
      event.metadata.mR_Number = faker.random.alphaNumeric(10);
    }
    if (event.metadata.serviceLocationAddress) {
      event.metadata.serviceLocationAddress = faker.address.streetAddress();
    }
  }

  return event;
}
console.log(data);
console.log(data.aggregations);
console.log(data.aggregations.buckets);

// Function to process all events
function processEvents(data) {
  // Check if data.aggregations and data.aggregations.unique_event_types are defined
  if (data.aggregations && data.aggregations.unique_event_types && data.aggregations.unique_event_types.buckets) {
    // Access buckets array under unique_event_types
    data.aggregations.unique_event_types.buckets.forEach(bucket => {
      bucket.example_event.hits.hits.forEach(hit => {
        hit._source = anonymizeEvent(hit._source);
      });
    });
  } else {
    console.error("Error: Invalid data structure");
  }
  return data;
}

// Process and anonymize the events
const anonymizedData = processEvents(data);

// Save the anonymized data to a new file
fs.writeFileSync('../json/autogenerated/anonymized_events.json', JSON.stringify(anonymizedData, null, 2));

console.log('Anonymization complete. Data saved to anonymized_events.json');