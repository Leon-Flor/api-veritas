import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;
const headers = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Request-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ...response,
      error: false,
    }),
  };
};

export const formatJSONResponse404 = (response?: Record<string, unknown>) => {
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({
      ...response,
      error: true,
    }),
  };
};

export const formatJSONResponse500 = (
  response?: Record<string, unknown>,
  error?: string
) => {
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({
      ...response,
      message: `Error en el sistema -> ${JSON.stringify(error)}`,
      error: true,
    }),
  };
};

export const cors = {
  origins: ["*"],
  headers: ["*"],
};
