/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();
http.route({
  path: "/clerk-webhooks",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log(214441224);

    const webhookSecret = process.env.CLERK_WEBHOOK_SECERT;
    console.log(webhookSecret, "webhookSecret");

    if (!webhookSecret) {
      return new Response("Dont have web hook keys", { status: 400 });
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");
    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("ErroZZZZr no svix header", {
        status: 40,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let evt: any;

    //verify
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      });
    } catch (error) {
      const err = error as Error;
      return new Response(
        JSON.stringify({
          message: "Webhook verification failed",
          error: err.message || "Unknown error",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const eventType = evt.type;
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();
      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: name,
          image: image_url,
          clerkId: id,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.log(error);
        return new Response("No connction", {
          status: 500,
        });
      }
    }

    return new Response("Success", {
      status: 200,
    });
  }),
});

export default http;
