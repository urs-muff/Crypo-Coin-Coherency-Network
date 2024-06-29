// functions/get-owner.js
exports.handler = async function(event, context) {
  const id = event.queryStringParameters.id;
  if (!id) {
    return { statusCode: 400, body: "Missing owner ID" };
  }

  // In a real implementation, you'd fetch this data from a database
  const owner = { id: id, name: "Example Owner", endpoint: "https://example.com/owner" };

  return {
    statusCode: 200,
    body: JSON.stringify(owner)
  };
}