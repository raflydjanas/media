import { INewUser } from "@/types";
import { ID } from "appwrite";
import { account, databases, storage, avatars, appwriteConfig } from "./config";

export const createUserAccount = async (user: INewUser) => {
  const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);

  if (!newAccount) throw Error;

  const avatarUrl = await avatars.getInitials(user.name);
};

// export const saveUserToDb = async (user: any) => {
//   const saveUser = await databases.createDocument(appwriteConfig.databasesId, appwriteConfig.usersCollectionId, ID.unique(), {});
// };
