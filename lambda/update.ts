import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import schema from "./schema";
import { z } from "zod";

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

    const result = schema.parse(item);
    console.log("Validated and augmented item:", result);

    // Construa a expressão de atualização dinamicamente
    const updateExpressions = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(item)) {
      const attributeKey = `#${key}`;
      const attributeValue = `:${key}`;
      updateExpressions.push(`${attributeKey} = ${attributeValue}`);
      expressionAttributeNames[attributeKey] = key;
      expressionAttributeValues[attributeValue] = value;
    }

    const updateExpression = `SET ${updateExpressions.join(", ")}`;
    console.log("Update Expression:", updateExpression);
    console.log("Expression Attribute Names:", expressionAttributeNames);
    console.log("Expression Attribute Values:", expressionAttributeValues);

    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };
    console.log("DynamoDB update parameters:", params);

    const data = await client.update(params).promise();
    console.log("Item updated successfully:", data);

    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
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
