import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const saveUserToDB = async (user: { accountId: string; email: string; name: string; imageUrl: URL; username: string }) => {
  try {
    const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), user);

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const signInAccount = async (user: { email: string; password: string }) => {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
};

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal("accountId", currentAccount.$id)]);

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export const signOutAccount = async () => {
  try {
    const userOut = await account.deleteSession("current");

    return userOut;
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (post: INewPost) => {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);

      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, ID.unique(), {
      creator: post.userId,
      caption: post.caption,
      imageUrl: fileUrl,
      imageId: uploadedFile.$id,
      location: post.location,
      tags: tags,
    });

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (file: File) => {
  try {
    const uploadFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);

    return uploadFile;
  } catch (error) {
    console.log(error);
  }
};

export const getFilePreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, "top", 100);

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getRecentPosts = async () => {
  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [Query.orderDesc("$createdAt"), Query.limit(20)]);

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (post: IUpdatePost) => {
  const hasFileToUpload = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpload) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatePost = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, post.postId, {
      caption: post.caption,
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      location: post.location,
      tags: tags,
    });

    if (!updatePost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatePost;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, postId, {
      likes: likesArray,
    });

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const savePost = async (userId: string, postId: string) => {
  try {
    const updatePost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.saveCollectionId, ID.unique(), {
      post: postId,
      user: userId,
    });

    if (!updatePost) throw Error;

    return updatePost;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.saveCollectionId, savedRecordId);

    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export async function getInfinitePosts({ pageParams }: { pageParams?: number }) {
  const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(10)];

  if (pageParams) {
    queries.push(Query.cursorAfter(pageParams.toString()));
  }

  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, queries);

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export const searchPosts = async (searchTerm: string) => {
  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [Query.search("caption", searchTerm)]);

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (postId: string) => {
  try {
    const postsId = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, postId);

    return postsId;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (postId?: string, imageId?: string) => {
  if (!postId || !imageId) return;
  try {
    const statusCode = await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, postId);

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (userId: string) => {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [Query.equal("creator", userId), Query.orderDesc("$createdAt")]);

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, userId);

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (limit?: number) => {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, queries);

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (user: IUpdateUser) => {
  const hasFileToUpdate = user.file.length > 0;

  try {
    let image = {
      imageId: user.imageId,
      imageUrl: user.imageUrl,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const updatedUser = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, user.userId, {
      name: user.name,
      bio: user.bio,
      imageUrl: image.imageUrl,
      imageId: image.imageId,
    });
    console.log("🚀 ~ updateUser ~ updatedUser:", updatedUser);

    if (!updatedUser) {
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      throw Error;
    }

    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};
