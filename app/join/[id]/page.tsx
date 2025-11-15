"use client";

import { OpenKit403Client } from "@openkitx403/client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function Join(props: PageProps<"/join/[id]">) {
  const [client, _] = useState(() => new OpenKit403Client());
  useEffect(() => {
    async function invoke() {
      const { id } = await props.params;
      if (!client["walletInstance"]) {
        try {
          await client.connect("phantom");
        } catch {
          try {
            await client.connect("backpack");
          } catch {
            await client.connect("solflare");
          }
        }
      }
      const result = await client.authenticate({
        resource: process.env.NEXT_PUBLIC_DOMAIN + "/api/join/" + id,
        method: "GET",
      });
      if (result) {
        const data: { link: string } = await result.json();
        redirect(data.link);
      }
    }
    invoke();
  });
  return (
    <>
      <h1>Joining</h1>
    </>
  );
}
