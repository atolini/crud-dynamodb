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

  const limit = event.queryStringParameters?.limit
    ? parseInt(event.queryStringParameters.limit)
    : 10;
  console.log("Limit parameter:", limit);

  const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey
    ? JSON.parse(event.queryStringParameters.lastEvaluatedKey)
    : null;
  console.log("LastEvaluatedKey parameter:", lastEvaluatedKey);

  const params = {
    TableName: tableName,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const result = await client.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey
          ? JSON.stringify(result.LastEvaluatedKey)
          : null,
      }),
    };
  } catch (error) {
    console.error("Error occurred:", error);

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
