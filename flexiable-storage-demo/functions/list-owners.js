// functions/list-owners.js
exports.handler = async function(event, context) {
  // In a real implementation, you'd fetch this data from a database
  const owners = [
    { id: 'owner1', name: 'Alice', endpoint: 'https://alice-endpoint.com' },
    { id: 'owner2', name: 'Bob', endpoint: 'https://bob-endpoint.com' },
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(owners)
  };
}