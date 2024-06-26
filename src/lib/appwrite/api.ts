import { INewUser } from "@/types";
import { ID } from "appwrite";
import { account } from "./config";

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);

    return newAccount;
  } catch (error) {
    console.log(error);
  }
};

// export const saveUserToDb = async (user: any) => {
//   const saveUser = await databases.createDocument(appwriteConfig.databasesId, appwriteConfig.usersCollectionId, ID.unique(), {});
// };
