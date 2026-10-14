import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

/** Check that local named types in the manifest are importable by consumers. */
export function validateCemTypes(packageRoot: string): string[] {
  const packageJson: { name: string; customElements: string } = JSON.parse(
    readFileSync(resolve(packageRoot, "package.json"), "utf8"),
  );
  const manifest: unknown = JSON.parse(readFileSync(resolve(packageRoot, packageJson.customElements), "utf8"));
  const references = new Map<string, Set<string>>();
  function visit(value: unknown): void {
    if (!value || typeof value !== "object") return;
    if ("references" in value && Array.isArray(value.references)) {
      for (const reference of value.references as unknown[]) {
        if (
          reference !== null &&
          typeof reference === "object" &&
          "module" in reference &&
          typeof reference.module === "string" &&
          "name" in reference &&
          typeof reference.name === "string" &&
          (!("package" in reference) || !reference.package || reference.package === packageJson.name)
        ) {
          const names = references.get(reference.module) ?? new Set<string>();
          names.add(reference.name);
          references.set(reference.module, names);
        }
      }
    }
    Object.values(value).forEach(visit);
  }
  visit(manifest);

  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    noEmit: true,
    skipLibCheck: true,
  };
  const resolved = new Map<string, string>();
  const errors: string[] = [];
  for (const module of references.keys()) {
    const specifier = `${packageJson.name}/${module.replace(/^\.\//, "")}`;
    const result = ts.resolveModuleName(
      specifier,
      resolve(packageRoot, "__cem_consumer__.ts"),
      options,
      ts.sys,
    ).resolvedModule;
    if (!result) errors.push(`Cannot resolve ${specifier}`);
    else resolved.set(module, result.resolvedFileName);
  }
  const program = ts.createProgram([...resolved.values()], options);
  const checker = program.getTypeChecker();
  for (const [module, fileName] of resolved) {
    const source = program.getSourceFile(fileName);
    const symbol = source && checker.getSymbolAtLocation(source);
    const exports = symbol ? new Set(checker.getExportsOfModule(symbol).map((item) => item.name)) : new Set<string>();
    for (const name of references.get(module) ?? []) {
      if (name !== "*" && !exports.has(name)) errors.push(`${packageJson.name}/${module} does not export ${name}`);
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = validateCemTypes(resolve(import.meta.dirname, ".."));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  }
}
