import crypto from "crypto";
import { IResolvers } from "apollo-server-express";
import { Google } from "../../../lib/api";
import { Database, Viewer, User } from "../../../lib/types";
import { LogInArgs } from "./types";
import { Response, Request } from "express";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | undefined> => {
  // Call our custom log user in function
  const { user } = await Google.logIn(code);

  if (!user) {
    throw new Error("Google log-in error");
  }
  // Name/Photo/Email lists
  const userNameList = user.names?.length ? user.names : null;
  const userPhotoList = user.photos?.length ? user.photos : null;
  const userEmailList = user.emailAddresses?.length
    ? user.emailAddresses
    : null;

  // User display name
  const userName = userNameList ? userNameList[0].displayName : null;
  // User ID
  const userId = (userNameList && userNameList[0].metadata?.source?.id) || null;
  // User avatar
  const userAvatar =
    userPhotoList && userPhotoList[0].url ? userPhotoList[0].url : null;
  // User Email
  const userEmail =
    userEmailList && userEmailList[0].value ? userEmailList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google Log-In error");
  }

  const updatedViewer = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnOriginal: false }
  );

  // Check if user already existed. If not, register
  let viewer = updatedViewer.value;

  if (!viewer) {
    const newUser = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });

    // Ops holds an array of insert results
    viewer = newUser.ops[0];
  }

  res.cookie("viewer", userId, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });
  // Return updated user or newly created one
  return viewer;
};

const logInViaCooke = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined> => {
  const result = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { token } },
    { returnOriginal: false }
  );

  const viewer = result.value;

  if (!viewer) {
    res.clearCookie("viewer", cookieOptions);
  }

  return viewer;
};

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error("Failed to query Google Auth: " + error);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, req, res }: { db: Database; req: Request; res: Response }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");
        const viewer = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCooke(token, db, req, res);

        if (!viewer) {
          return { didRequestGoogleInfo: true };
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequestGoogleInfo: true,
        };
      } catch (error) {
        throw new Error(`Failed to log user in: ${error}`);
      }
    },
    logOut: (
      _root: undefined,
      _args: unknown,
      { res }: { res: Response }
    ): Viewer => {
      try {
        res.clearCookie("viewer", cookieOptions);

        return { didRequestGoogleInfo: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => viewer._id,
    hasWallet: (viewer: Viewer): boolean | undefined =>
      viewer.walletId ? true : undefined,
  },
};
