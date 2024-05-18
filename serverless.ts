import type { AWS } from "@serverless/typescript";

import {
  createQuiz,
  deleteQuiz,
  getAllQuizzesByOwner,
  getQuizById,
  updateQuiz,
} from "@functions/index";
const serverlessConfiguration: AWS = {
  service: "api-veritas",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",

      DYNAMODB_TABLE_NAME: "${env:DYNAMODB_TABLE_NAME}",
      DYNAMODB_TABLE_ARN: "${env:DYNAMODB_TABLE_ARN}",
      SECRET_NEXT_TOKEN: "${env:SECRET_NEXT_TOKEN}",
    },

    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: [
              "${env:DYNAMODB_TABLE_ARN}",
              "${env:DYNAMODB_TABLE_ARN}/index/gsi1pk-gsi1Erased-index",
            ],
          },
        ],
      },
    },
    stage: "${opt:stage, 'dev'}",
    region: "us-east-1",
  },

  functions: {
    createQuiz,
    deleteQuiz,
    getAllQuizzesByOwner,
    getQuizById,
    updateQuiz,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
