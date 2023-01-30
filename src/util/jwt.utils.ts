// import { verify } from 'jsonwebtoken';
// import env from '../util/validateEnv'

// interface TokenPayload {
//     userId:number,
//     userName:string,
//   }

// export function validateToken(token: string): Promise<TokenPayload> {
  
//     return new Promise((resolve, reject) => {
//       verify(token, env.JWT_SECRET, (error, decoded: TokenPayload) => {
//         if (error) return reject(error);
//         resolve(decoded);
//       })
//     });
//   }