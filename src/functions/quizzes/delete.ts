import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
  formatJSONResponse500,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

const deleteProduct: ValidatedEventAPIGatewayProxyEvent<null> = async (
  event
) => {
  const timestamp = new Date().toISOString();
  const id = event.pathParameters?.id || "";

  try {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || "",
      Key: {
        gsi1pk: "QUIZ",
        pk: `QUIZ#${id}`,
      },
      UpdateExpression: "set gsi1Erased = :gsi1Erased, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":gsi1Erased": 1,
        ":updatedAt": timestamp,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamoDb.update(params).promise();
    return formatJSONResponse({
      action: "deleteProduct",
    });
  } catch (error) {
    return formatJSONResponse500({ action: "deleteProduct" }, error);
  }
};

export const main = middyfy(deleteProduct);
