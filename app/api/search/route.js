import Prompt from "@models/prompt";
import User from "@models/user";
import { connectTodDB } from "@utils/database";

export const POST = async (request) => {
  let { text } = await request.json();
  try {
    if (!text) {
      return new Response(
        { data: null, message: "Search text is required" },
        { status: 400 }
      );
    }
    await connectTodDB();
    //   search by username
    const user = await User.findOne({ username: text });
    let prompts = [];
    if (user) {
      prompts = await Prompt.find({ creator: user._id }).populate("creator");
    } else {
      // search by tag
      const tagRegex = new RegExp(text, "i");
      prompts = await Prompt.find({ tag: tagRegex }).populate("creator");
    }
    return new Response(JSON.stringify({ data: prompts }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ data: null, message: "Failed to fetch prompts", error }),
      { status: 500 }
    );
  }
};
