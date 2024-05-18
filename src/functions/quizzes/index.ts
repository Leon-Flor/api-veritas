import { handlerPath } from "@libs/handler-resolver";
import { cors } from "../../libs/api-gateway";

export const createQuiz = {
  handler: `${handlerPath(__dirname)}/create.main`,
  events: [
    {
      http: {
        method: "post",
        path: "/api/v1/quiz",
        cors,
      },
    },
  ],
};

export const deleteQuiz = {
  handler: `${handlerPath(__dirname)}/delete.main`,
  events: [
    {
      http: {
        method: "delete",
        path: "/api/v1/quiz/{id}",
        cors,
      },
    },
  ],
};

export const getAllQuizzesByOwner = {
  handler: `${handlerPath(__dirname)}/getAll.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/api/v1/quiz",
        cors,
      },
    },
  ],
};

export const getQuizById = {
  handler: `${handlerPath(__dirname)}/getById.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/api/v1/quiz/{id}",
        cors,
      },
    },
  ],
};

export const updateQuiz = {
  handler: `${handlerPath(__dirname)}/update.main`,
  events: [
    {
      http: {
        method: "put",
        path: "/api/v1/quiz/{id}",
        cors,
      },
    },
  ],
};
