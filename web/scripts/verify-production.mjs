const baseUrl = (process.argv[2] ?? process.env.PROMOGAMES_VERIFY_URL ?? "http://localhost:3000").replace(/\/$/, "");
const storySlug = "/novidades-de-julho-no-catalogo-playstation-plus-avatar-rise-of-the-ronin-e-incendios-reais-chegam-com-tudo/";

const checks = [
  { path: "/", status: 200, contains: "No controle agora" },
  { path: "/categoria/playstation/", status: 200, contains: "PlayStation" },
  { path: "/buscar/?q=PlayStation", status: 200, contains: "Resultados para" },
  { path: storySlug, status: 200, contains: "application/ld+json" },
  { path: "/robots.txt", status: 200, contains: "Sitemap:" },
  { path: "/sitemap.xml", status: 200, contains: storySlug },
  { path: "/api/draft/?id=1&secret=invalido", status: 401, contains: "autorizado" },
];

const results = [];
for (const check of checks) {
  const startedAt = performance.now();
  const response = await fetch(`${baseUrl}${check.path}`, { redirect: "manual" });
  const body = await response.text();
  const passed = response.status === check.status && body.toLowerCase().includes(check.contains.toLowerCase());
  results.push({ path: check.path, status: response.status, expectedStatus: check.status, durationMs: Math.round(performance.now() - startedAt), passed });
}

console.log(JSON.stringify({ baseUrl, checkedAt: new Date().toISOString(), results }, null, 2));
if (results.some((result) => !result.passed)) process.exitCode = 1;
