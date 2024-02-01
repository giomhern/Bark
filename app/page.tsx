import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "./auth-button";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Likes from "./likes";

// anything in the app directory is automatically a server component unless
// directed by using the 'use client' directive at the top of the page

// async lets us fetch data in the same component
export default async function Home() {
  // runs all on the server
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_ANON_KEY;
  const supabase = createServerComponentClient<Database>(
    { cookies },
    { supabaseUrl: url, supabaseKey: key }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("tweets")
    .select("*, profiles(*), likes(*)");

  const tweets = data?.map((tweet) => ({
    ...tweet,
    user_has_liked_tweet: tweet.likes.find(
      (like) => like.user_id === session.user.id
    ),
    likes: tweet.likes.length,
  })) ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet) => (
        <div key={tweet.id}>
          <p>
            {tweet?.profiles?.name} {tweet?.profiles?.user_name}
          </p>
          <p>{tweet.tweet}</p>
          <Likes tweet={tweet} />
        </div>
      ))}
    </div>
  );
}
