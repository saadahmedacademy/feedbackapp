import { dbConnect } from "@/lib/dbConnect";
import { Messages, User } from "@/model/user.model";

export async function POST(request: Request) {

    // Connect to the database
    await dbConnect();

    try {
        const { username, content } = await request.json();

        if (!username || !content) {
            return new Response(
                JSON.stringify({ success: false, message: "username and content are required" }),
                { status: 400 }
            );
        }

        // Find user by username
        const findUser = await User.findOne({ username });

        if (!findUser) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        if (!findUser.isAcceptingMessage) {
            return new Response(
                JSON.stringify({ success: false, message: "User is not accepting messages" }),
                { status: 403 }
            );
        }

        // Send message
        const sendMessage = {
            content,
            createdAt: new Date(),
        };

        findUser.messages.push(sendMessage as Messages);
        await findUser.save();

        // Return the Response
        return new Response(
            JSON.stringify({ success: true, message: "Message sent successfully", data: sendMessage }),
            { status: 201 }
        );

    } catch (error) {
        console.error("Something went wrong while sending message:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Something went wrong while sending message" }),
            { status: 500 }
        );
    }
}
