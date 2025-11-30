
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true; // copiado con éxito
  } catch (err) {
    console.error("Error al copiar:", err);
    return false; // falló
  }
}