import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import {
  formatJSONResponse,
  formatJSONResponse404,
  formatJSONResponse500,
} from "@libs/api-gateway";
import { decodeToken, generateToken } from "@libs/generateToken";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

const getAllQuizzesByOwner: ValidatedEventAPIGatewayProxyEvent<null> = async (
  event
) => {
  const ownerId = event.queryStringParameters?.ownerId || "";
  const limit = event.queryStringParameters?.limit || "10";
  const nextTokenPaginate = event.queryStringParameters?.nextToken || "";

  try {
    let data = null;
    if (nextTokenPaginate) {
      data = await decodeToken(nextTokenPaginate);
    }

    let params: DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || "",
      IndexName: "gsi1pk-gsi1Erased-index",
      KeyConditionExpression: "gsi1pk = :pk AND #gsi1Erased = :gsi1Erased",
      ExpressionAttributeValues: {
        ":pk": "QUIZ",
        ":gsi1Erased": 0,
      },
      ExpressionAttributeNames: {
        "#gsi1Erased": "gsi1Erased",
      },
      Limit: parseInt(limit),
      ExclusiveStartKey: nextTokenPaginate ? data : null,
    };

    if (ownerId) {
      params.FilterExpression = "owner = :ownerId";
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ":ownerId": ownerId,
      };
      params.ExpressionAttributeNames = {
        ...params.ExpressionAttributeNames,
        "#ownerId": "ownerId",
      };

      const result = await dynamoDB.query(params).promise();

      const sortedItems = result.Items.map((item) => {
        return {
          pk: item.pk,
          gsi1pk: item.gsi1pk,
          gsi1Erased: item.gsi1Erased,
          title: item.title,
          description: item.description,
          questions: item.questions,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      }).sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        } else if (a.title < b.title) {
          return -1;
        } else {
          return 0;
        }
      });

      let nextToken = null;
      if (result.LastEvaluatedKey) {
        nextToken = await generateToken(result.LastEvaluatedKey);
      }

      return formatJSONResponse({
        action: "getAllQuizzesByOwner",
        items: sortedItems,
        nextToken: nextToken,
      });
    } else {
      return formatJSONResponse404({
        action: "getAllQuizzesByOwner",
        message: "Quizzes not found",
      });
    }
  } catch (error) {
    return formatJSONResponse500({ action: "getAllQuizzesByOwner" }, error);
  }
};

export const main = middyfy(getAllQuizzesByOwner);
