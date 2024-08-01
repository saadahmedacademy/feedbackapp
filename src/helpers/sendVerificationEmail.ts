import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationEmil";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVarificationEmail = async (
    username :string,
    VerifyCode :string,
    email :string
) : Promise<ApiResponse> => {
    try {

        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Verify your account',
            react: VerificationEmail({ username, otp: VerifyCode }),
          });
      
       return { success: true, message: "verification email send successfully" }
    } catch (error) {
        console.error(`verification email send failed: ${error}`)
        return { success: false, message: "verification email send failed" }
    }
}



