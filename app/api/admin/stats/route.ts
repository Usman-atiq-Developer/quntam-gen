import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import ContactMessage from "@/models/ContactMessage";
import Post from "@/models/Post";
import LinkInsertion from "@/models/LinkInsertion";
import { toApiErrorResponse } from "@/lib/apiError";

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalMessages,
      unreadMessages,
      totalPosts,
      publishedPosts,
      draftPosts,
      totalLinkInsertions,
      pendingLinkInsertions,
      approvedLinkInsertions,
      recentMessages,
      recentLinkInsertions,
    ] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: "new" }),
      Post.countDocuments(),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      LinkInsertion.countDocuments(),
      LinkInsertion.countDocuments({ status: "pending" }),
      LinkInsertion.countDocuments({ status: "approved" }),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
      LinkInsertion.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      messages: { total: totalMessages, unread: unreadMessages },
      posts: { total: totalPosts, published: publishedPosts, draft: draftPosts },
      linkInsertions: {
        total: totalLinkInsertions,
        pending: pendingLinkInsertions,
        approved: approvedLinkInsertions,
      },
      recentMessages,
      recentLinkInsertions,
    });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load dashboard stats");
  }
}
