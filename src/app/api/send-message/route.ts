import { dbConnect } from "@/lib/dbConnect";
import { Message, User } from "@/model/user.model";

export async function POST(request: Request) {
    
    // Connect to the database

    await dbConnect();
    const { message } = await request.json();

    if (!message || message.trim() === "") {
        return new Response(
            JSON.stringify({ success: false, message: "send a message" }),
            { status: 400 }
        );
    }
    
}