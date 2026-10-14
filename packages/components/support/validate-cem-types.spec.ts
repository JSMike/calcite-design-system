import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, expect, it } from "vitest";
import { validateCemTypes } from "./validate-cem-types";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const roots: string[] = [];
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

function fixture(exports = packageJson.exports): string {
  const root = mkdtempSync(join(tmpdir(), "calcite-cem-"));
  roots.push(root);
  writeFileSync(join(root, "package.json"), JSON.stringify({ ...packageJson, exports }));
  const references = [
    ["components/types", "Scale"],
    ["components/calcite-button/types", "ButtonAlignment"],
    ["components/functional/Heading", "HeadingLevel"],
    ["components/calcite-color-picker/utils", "Format"],
    ["components/calcite-list/resources", "ListDisplayMode"],
    ["utils/floating-ui", "OverlayPositioning"],
    ["controllers/useFocusTrap", "FocusTrapOptions"],
  ];
  for (const [module, name] of references) {
    const file = join(root, "dist", `${module}.d.ts`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `export type ${name} = 'a' | 'b';`);
  }
  mkdirSync(join(root, "dist/docs"), { recursive: true });
  writeFileSync(
    join(root, packageJson.customElements),
    JSON.stringify({
      modules: [
        {
          declarations: [
            {
              members: references.map(([module, name]) => ({
                type: { text: name, references: [{ module, name }] },
              })),
            },
          ],
        },
      ],
    }),
  );
  return root;
}

it("resolves public manifest type references through package exports", () => {
  expect(validateCemTypes(fixture())).toEqual([]);
});

it("detects declaration files hidden by the exports map", () => {
  expect(validateCemTypes(fixture({ "./components/*": "./dist/components/*/index.js" }))).toContain(
    "Cannot resolve @esri/calcite-components/components/types",
  );
});

it("detects a reference to a name the target declaration does not export", () => {
  const root = fixture();
  writeFileSync(join(root, "dist/components/types.d.ts"), "export type DifferentName = string;");
  expect(validateCemTypes(root)).toContain("@esri/calcite-components/components/types does not export Scale");
});

it("keeps type-only entries unavailable to runtime imports", () => {
  const root = fixture();
  const require = createRequire(join(root, "consumer.js"));
  expect(() => require.resolve(`${packageJson.name}/utils/floating-ui`)).toThrow(/not defined by "exports"/);
});
