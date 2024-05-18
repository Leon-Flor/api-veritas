import * as jwt from "jsonwebtoken";

export const generateToken = async (LastEvaluatedKey: any) => {
  try {
    return await jwt.sign(LastEvaluatedKey, process.env.SECRET_NEXT_TOKEN, {
      expiresIn: "30d",
    });
  } catch (error) {
    console.log("❌ Error -> generateToken", error);
    throw new Error(error);
  }
};

export const decodeToken = async (nextTokenPaginate: string) => {
  try {
    const { iat, exp, ...data }: any = await jwt.verify(
      nextTokenPaginate,
      process.env.SECRET_NEXT_TOKEN
    );
    return data;
  } catch (error) {
    console.log("❌ Error -> decodeToken", error);
    throw new Error(error);
  }
};
