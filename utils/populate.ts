export function strict_false(
  populate: any
): { path: string; strictPopulate: boolean }[] {
  let toPopulate: { path: string; strictPopulate: boolean }[] = [];
  if (Array.isArray(populate)) {
    toPopulate = populate.map((popu) => ({
      path: popu,
      strictPopulate: false,
    })) as { path: string; strictPopulate: boolean }[];
  } else if (typeof populate === "string") {
    toPopulate.push({ path: populate, strictPopulate: false });
  }
  return toPopulate;
}
