import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "./prisma";

export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.TRAX_ACCESS_TOKEN;

    if (token) {
      let user;
      try {
        const { id } = jwt.verify(token, "hello");

        if (id) {
          user = await prisma.user.findUnique({
            where: {
              id,
            },
          });
        } else {
          throw new Error("No id in token");
        }

        if (!user) {
          throw new Error("Not real user");
        }
      } catch (error) {
        res.status(401);
        res.json({
          error: "Not Authorized",
        });
        return;
      }
      return handler(req, res, user);
    }

    res.status(401);
    res.json({
      error: "Not Authorized",
    });
  };
};

export const validateToken = (token) => {
  const user = jwt.verify(token, "hello");
  return user;
};
