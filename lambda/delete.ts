import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const client = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('Received context:', JSON.stringify(context, null, 2));

  const id = event.pathParameters?.id;

  if (!id) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: 'ID is missing in the request path' }),
    };
    console.log('Response:', JSON.stringify(response, null, 2));
    return response;
  }

  console.log('ID from path parameters:', id);

  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    console.log('Deleting item from DynamoDB:', id);
    await client.delete(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item deleted successfully' }),
    };

    console.log('Item deleted successfully:', id);
    console.log('Response:', JSON.stringify(response, null, 2));
    return response;
  } catch (error: unknown) {
    console.error('Error deleting item:', error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: (error as Error).message,
      }),
    };

    console.log('Response:', JSON.stringify(response, null, 2));

    return response;
  }
};
