export const schema = {
  type: "object",
  properties: {
    owner: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
          type: { type: "string" },
          answers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                text: { type: "string" },
                img: { type: "string" },
              },
              required: ["id", "text", "img"],
            },
          },
        },
        required: ["question", "answer", "type", "answers"],
      },
    },
  },

  required: ["owner", "title", "description", "questions"],
} as const;
