import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
  formatJSONResponse500,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidV4 } from "uuid";

import { schema } from "./schema";

const dynamoDb = new DynamoDB.DocumentClient();

const createQuiz: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const timestamp = new Date().toISOString();
    const id = uuidV4();
    const { owner, title, description, questions } = event.body;

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || "",
      Item: {
        gsi1pk: "QUIZ",
        pk: `QUIZ#${id}`,
        owner,
        title,
        description,
        questions,
        gsi1Erased: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };
    await dynamoDb.put(params).promise();
    return formatJSONResponse({
      action: "createQuiz",
    });
  } catch (error) {
    return formatJSONResponse500({ action: "createQuiz" }, error);
  }
};

export const main = middyfy(createQuiz);
