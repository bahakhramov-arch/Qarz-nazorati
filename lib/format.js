export function formatSom(n) {
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString("uz-UZ").replace(/,/g, " ");
}

export function typeLetter(type) {
  if (type === "Kredit") return "K";
  if (type === "Mikroqarz") return "M";
  return "N";
}
