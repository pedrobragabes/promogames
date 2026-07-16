import { revalidatePath, revalidateTag } from "next/cache";
import { safeSecretEqual } from "@/lib/security";

type RevalidationPayload = {
  secret?: string;
  slug?: string;
  tags?: string[];
  paths?: string[];
};

const coreTags = ["wordpress", "stories", "categories", "authors"];

export async function POST(request: Request) {
  let payload: RevalidationPayload;
  try {
    payload = await request.json() as RevalidationPayload;
  } catch {
    return Response.json({ error: "JSON inválido." }, { status: 400 });
  }

  const suppliedSecret = request.headers.get("x-promogames-secret") ?? payload.secret;
  if (!safeSecretEqual(suppliedSecret, process.env.REVALIDATE_SECRET)) {
    return Response.json({ error: "Webhook não autorizado." }, { status: 401 });
  }

  const allowedTags = new Set(coreTags);
  if (payload.slug && /^[a-z0-9-]+$/.test(payload.slug)) allowedTags.add(`story:${payload.slug}`);
  for (const tag of payload.tags ?? []) {
    if (/^(wordpress|stories|categories|authors|story:[a-z0-9-]+)$/.test(tag)) allowedTags.add(tag);
  }
  for (const tag of allowedTags) revalidateTag(tag, { expire: 0 });

  const paths = new Set(["/"]);
  if (payload.slug && /^[a-z0-9-]+$/.test(payload.slug)) paths.add(`/${payload.slug}/`);
  for (const path of payload.paths ?? []) {
    if (/^\/(categoria|autor)\/[a-z0-9-]+\/$/.test(path)) paths.add(path);
  }
  for (const path of paths) revalidatePath(path, "page");

  console.info("[promogames] Conteúdo revalidado", { tags: [...allowedTags], paths: [...paths] });

  return Response.json({ revalidated: true, tags: [...allowedTags], paths: [...paths], at: new Date().toISOString() });
}
