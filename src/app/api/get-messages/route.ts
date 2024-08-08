import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User as nextUser } from "next-auth";
import { User } from "@/model/user.model";
import mongoose from "mongoose";


// To get all messages
export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as nextUser;

  if (!session || !user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authorized User" }),
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // To get all messages by matching user id and sort by created time 
    const foundUser = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        }
      }
    ]);

    if (!foundUser || foundUser.length === 0 || !foundUser[0].messages.length) {
      return new Response(
        JSON.stringify({ success: false, message: "User or user messages not found or empty" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User and user messages found", user: foundUser[0].messages }),
      { status: 200 }
    );

  } catch (error) {
    console.error(`Error fetching user messages:\n${error}`);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred while fetching user messages" }),
      { status: 500 }
    );
  }
}
