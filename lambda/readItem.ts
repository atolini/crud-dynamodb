import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const client = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const id = event.pathParameters?.id;

  if (!id) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: "ID is missing in the request path" }),
    };
    console.log("Response:", JSON.stringify(response, null, 2));
    return response;
  }

  console.log("ID from path parameters:", id);

  const params = {
    TableName: tableName,
    Key: { id },
  };

  console.log(
    "Attempting to fetch item from DynamoDB with params:",
    JSON.stringify(params, null, 2),
  );

  try {
    const result = await client.get(params).promise();
    console.log("DynamoDB response:", JSON.stringify(result, null, 2));

    if (!result.Item) {
      const response = {
        statusCode: 404,
        body: JSON.stringify({ message: "Item not found" }),
      };
      console.log("Response:", JSON.stringify(response, null, 2));
      return response;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    console.log("Response:", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("Error fetching item from DynamoDB:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
    console.log("Response:", JSON.stringify(response, null, 2));
    return response;
  }
};
