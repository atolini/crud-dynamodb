import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";

export class BoilerplateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'ItemsTable', {
      tableName: "Itens",
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda Functions
    const createLambda = new nodejs.NodejsFunction(this, "CreateLambda", {
      entry: './lambda/create.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const readItemLambda = new nodejs.NodejsFunction(this, "ReadItemLambda", {
      entry: './lambda/readItem.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const listItemsLambda = new nodejs.NodejsFunction(this, "ListItemsLambda", {
      entry: './lambda/listItems.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const updateLambda = new nodejs.NodejsFunction(this, "UpdateLambda", {
      entry: './lambda/update.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const deleteLambda = new nodejs.NodejsFunction(this, "DeleteLambda", {
      entry: './lambda/delete.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant DynamoDB permissions to Lambda functions
    table.grantReadWriteData(createLambda);
    table.grantReadWriteData(readItemLambda);
    table.grantReadWriteData(updateLambda);
    table.grantReadWriteData(deleteLambda);
    table.grantReadWriteData(listItemsLambda);

    // API Gateway
    const api = new apiGateway.RestApi(this, 'itemsApi', {
      restApiName: 'Items Service',
      description: 'This service serves items.',
      endpointConfiguration: {
        types: [apiGateway.EndpointType.REGIONAL]
      },
    });

    const items = api.root.addResource('items');
    items.addMethod('POST', new apiGateway.LambdaIntegration(createLambda));

    items.addMethod('GET', new apiGateway.LambdaIntegration(listItemsLambda));

    const singleItem = items.addResource('{id}');
    singleItem.addMethod('GET', new apiGateway.LambdaIntegration(readItemLambda), {
      requestParameters: {
        'method.request.path.id': true
      }
    });
    singleItem.addMethod('PUT', new apiGateway.LambdaIntegration(updateLambda));
    singleItem.addMethod('DELETE', new apiGateway.LambdaIntegration(deleteLambda));

  }
}
