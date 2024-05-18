import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
  formatJSONResponse500,
} from "@libs/api-gateway";
import { schema } from "./schema";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

const updateQuiz: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { title, description, questions } = event.body;

  const id = event.pathParameters.id;
  try {
    const timestamp = new Date().toISOString();

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || "",
      Key: {
        gsi1pk: "QUIZ",
        pk: `QUIZ#${id}`,
      },
      UpdateExpression:
        "set #title = :title, #description = :description, #questions = :questions, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#title": "title",
        "#description": "description",
        "#questions": "questions",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":title": title,
        ":description": description,
        ":questions": questions,
        ":updatedAt": timestamp,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamoDb.update(params).promise();

    return formatJSONResponse({
      action: "updateQuiz",
    });
  } catch (error) {
    return formatJSONResponse500({ action: "updateQuiz" }, error);
  }
};

export default middyfy(updateQuiz);
