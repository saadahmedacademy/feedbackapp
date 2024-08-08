import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/model/user.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signupSchema";

const usernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {

  // To connect db
  await dbConnect();
  try {
    // To get query params
    const { searchParams } = new URL(request.url);
    
    // To get username 
    const queryParam = {
      username: searchParams.get('username')
    };

    // To verify the username
    const result = usernameQuerySchema.safeParse(queryParam);
    console.log('result', result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return new Response(JSON.stringify({
        success: false,
        message: usernameError.length > 0 ? usernameError.join(', ') 
          : "Invalid query parameters"
      }), { status: 400 });
    }
    
    const { username } = result.data;

    const existingUser = await User.findOne({
      username,
      isVerified:true
    });

    if (existingUser) {
      return new Response(JSON.stringify({
        success: false,
        message: "This username is already taken"
      }), { status: 400 });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "This username is available"
    }), { status: 200 });

  } catch (err) {
    console.error(`Something went wrong while checking username: ${err}`);
    return new Response(JSON.stringify({
      success: false,
      message: "Something went wrong while checking username",
    }), { status: 500 });
  }
}
