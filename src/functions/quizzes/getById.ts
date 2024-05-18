import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import {
  formatJSONResponse,
  formatJSONResponse404,
  formatJSONResponse500,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

const getQuizById: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  const id = event.pathParameters?.id;

  try {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || "",
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `QUIZ#${id}`,
      },
      Limit: 1,
    };

    const result = await dynamoDB.query(params).promise();

    if (
      result &&
      result.Items &&
      result?.Items.length > 0 &&
      result.Items[0].gsi1Erased === 0
    ) {
      return formatJSONResponse({
        action: "getQuizById",
        data: result.Items[0],
      });
    }

    return formatJSONResponse404({
      action: "getQuizById",
      message: "Quiz not found",
    });
  } catch (error) {
    return formatJSONResponse500({ action: "getQuizById" }, error);
  }
};

export const main = middyfy(getQuizById);
