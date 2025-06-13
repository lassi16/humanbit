import prompt from "prompt-sync";

const promptSync = prompt();

function getUserInput() {
  const postalText = promptSync(
    "📍 Enter postal address (e.g., '781104, Guwahati, Assam, India'): "
  );
  const postalId = promptSync("🆔 Enter postal ID (e.g., '101041448'): ");
  const page = parseInt(promptSync("📄 Enter page number: "), 10) || 1;

  return { postalText, postalId, page };
}

export { getUserInput };
