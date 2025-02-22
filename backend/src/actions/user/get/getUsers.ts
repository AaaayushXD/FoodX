import { paginateFnc } from "../../../helpers/paginate/paginate.js";

export const getUsersFromDatabase = async (
  path: "customer" | "admin" | "chef",
  pageSize: number,
  filter: keyof User.UserInfo = "createdAt",
  sort: "asc" | "desc" = "asc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next"
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      path,
      filter,
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction
    );
    const usersDoc = await query.get();
    const users: User.UserInfo[] = [];

    usersDoc.docs.forEach((doc) => {
      users.push(doc.data() as User.UserInfo);
    });

    const firstDoc = usersDoc.docs[0]?.data().uid || null;
    const lastDoc = usersDoc.docs[usersDoc.docs.length - 1]?.data().uid || null;

    return {
      users,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new Error("Error fetching users from database.");
  }
};
