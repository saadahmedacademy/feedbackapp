import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/model/user.model";
import bcrypt from "bcrypt";
import { sendVarificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Find user by username
    const existUserByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existUserByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: "This username already exists" }),
        { status: 400 }
      );
    }

    // Find user by email
    const existUserByEmail = await User.findOne({ email });

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCodeExpire = new Date(Date.now() + 3600000); // 1 hour from now

    if (existUserByEmail) {
      if (existUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({ success: false, message: "This email already exists" }),
          { status: 400 }
        );
      } else {
        existUserByEmail.verifyCode = verificationCode;
        existUserByEmail.verifyCodeExpire = verificationCodeExpire;
        existUserByEmail.password = hashedPassword;
        await existUserByEmail.save();
      }
    } else {
      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode: verificationCode,
        verifyCodeExpire: verificationCodeExpire,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
      console.log(`newUser:`, newUser);
    }

    // Send verification email
    const emailResponse = await sendVarificationEmail(username, verificationCode, email);

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({ success: emailResponse.success, message: emailResponse.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Signup successful" }),
      { status: 200 }
    );

  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return new Response(
      JSON.stringify({ success: false, message: "Signup failed" }),
      { status: 500 }
    );
  }
}
