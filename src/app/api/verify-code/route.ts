import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/model/user.model";

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    // Parse the request body
    const body = await request.json();
    const { username, code } = body;

    if (!username || !code) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username and code are required",
        }),
        { status: 400 }
      );
    }

    // Decode the username if it came through the URL
    const decodedUsername = decodeURIComponent(username);
    const findUser = await User.findOne({ username: decodedUsername });

    if (!findUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized request, User not found",
        }),
        { status: 400 }
      );
    }

    // Verify the code
    const isCodeCorrect = findUser.verifyCode === code;
    if (!isCodeCorrect) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid verification code",
        }),
        { status: 400 }
      );
    }

    // Check if the code has expired
    const checkExpiry = new Date(findUser.verifyCodeExpire) > new Date();
    if (!checkExpiry) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Verification code has expired",
        }),
        { status: 400 }
      );
    }

    // If both checks pass, verify the user
    findUser.isVerified = true;
    await findUser.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "User verified successfully!",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(`Something went wrong while verifying the user code: ${err}`);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong while verifying the user code",
      }),
      { status: 500 }
    );
  }
}
