import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/proyectos-integrativos",
  "/modelos/crea-studios",
];

for (const route of routes) {
  test(`${route} carga sin errores críticos`, async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    expect(response, `La ruta ${route} no respondió`).not.toBeNull();
    expect(response!.status(), `Estado HTTP incorrecto en ${route}`).toBeLessThan(400);

    await page.waitForLoadState("networkidle", {
      timeout: 15000,
    }).catch(() => {});

    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("body")).not.toBeEmpty();

    expect(
      pageErrors,
      `Errores JavaScript encontrados en ${route}`,
    ).toEqual([]);

    expect(
      consoleErrors,
      `Errores de consola encontrados en ${route}`,
    ).toEqual([]);
  });
}

test("todos los enlaces internos responden", async ({
  page,
  request,
  baseURL,
}) => {
  const routesToInspect = [
    "/",
    "/proyectos-integrativos",
    "/modelos/crea-studios",
  ];

  const internalUrls = new Set<string>();

  for (const route of routesToInspect) {
    await page.goto(route, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const hrefs = await page.locator("a[href]").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")).filter(Boolean),
    );

    for (const href of hrefs) {
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        continue;
      }

      const url = new URL(href, baseURL);

      if (url.origin === new URL(baseURL!).origin) {
        internalUrls.add(url.toString());
      }
    }
  }

  expect(internalUrls.size).toBeGreaterThan(0);

  for (const url of internalUrls) {
    const response = await request.get(url);
    expect(
      response.status(),
      `Enlace roto: ${url}`,
    ).toBeLessThan(400);
  }
});
