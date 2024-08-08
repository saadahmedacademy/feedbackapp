import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User as nextUser } from "next-auth";
import { User } from "@/model/user.model";

// To update the message accepting status
export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as nextUser;

  if (!session || !user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authorized User" }),
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptingMessages } = await request.json();

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { isAcceptingMessage: acceptingMessages },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found or unable to update accepting messages status",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Toggle message status has been updated successfully",
        updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating toggle status:\n${error}`);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while updating toggle status",
      }),
      { status: 500 }
    );
  }
}

// To see the toggle status
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

  const userId = user._id;

  try {
    const foundUser = await User.findOne({ _id: userId });
    if (!foundUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User found",
        isAcceptingMessages: foundUser.isAcceptingMessage,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error retrieving toggle status:\n${error}`);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while retrieving toggle status",
      }),
      { status: 500 }
    );
  }
}
