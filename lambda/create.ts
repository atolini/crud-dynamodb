import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { z } from "zod";
import schema from "./schema";

const client = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  try {
    if (!event.body) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad Request: No body provided" }),
      };
      console.warn("No body provided in the event", response);
      return response;
    }

    const item = JSON.parse(event.body);
    console.log("Parsed item:", item);

    const result = schema.parse({ id: Date.now().toString(), ...item });
    console.log("Validated and augmented item:", result);

    const params = {
      TableName: tableName,
      Item: result,
    };
    console.log("DynamoDB put parameters:", params);

    await client.put(params).promise();
    console.log("Successfully inserted item into DynamoDB");

    const response = {
      statusCode: 201,
      body: JSON.stringify(result),
    };
    console.log("Response:", response);
    return response;
  } catch (error: unknown) {
    console.error("Error occurred:", error);

    if (error instanceof z.ZodError) {
      console.warn("Validation error:", error.errors);
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          message: "Validation error",
          errors: error.errors,
        }),
      };
      console.log("Response:", response);
      return response;
    }

    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: (error as Error).message,
      }),
    };
    console.log("Response:", response);
    return response;
  }
};
