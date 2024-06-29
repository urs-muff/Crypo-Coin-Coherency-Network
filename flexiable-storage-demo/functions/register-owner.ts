// functions/register-owner.js
exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { id, name, endpoint } = JSON.parse(event.body);
    // In a real implementation, you'd save this data to a database
    console.log(`Registering owner: ${name} (${id}) at ${endpoint}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Owner registered successfully" })
    };
  } catch (error) {
    return { statusCode: 400, body: "Invalid request body" };
  }
}