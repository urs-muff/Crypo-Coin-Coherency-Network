// functions/find-owner.js
exports.handler = async function(event, context) {
  const name = event.queryStringParameters.name;
  if (!name) {
    return { statusCode: 400, body: "Missing owner name" };
  }

  // In a real implementation, you'd search for this in a database
  const owners = [
    { id: 'owner1', name: 'Alice', endpoint: 'https://alice-endpoint.com' },
    { id: 'owner2', name: 'Bob', endpoint: 'https://bob-endpoint.com' },
  ];

  const owner = owners.find(o => o.name.toLowerCase() === name.toLowerCase());

  if (owner) {
    return {
      statusCode: 200,
      body: JSON.stringify(owner)
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Owner not found" })
    };
  }
}