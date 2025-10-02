// import jwt, { JwtPayload } from "jsonwebtoken";
// import { NextRequest } from "next/server";
// import { JwtUserPayload } from "../types/next-auth";

// export function verifyToken(req: NextRequest): JwtUserPayload | null {
//   try {
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return null;
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload;

//     return decoded;
//   } catch (err) {
//     return null;
//   }
// }
