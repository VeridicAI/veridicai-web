import { useState } from "react";

export default function VeridicAIInterface() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:1234/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const completion = data.choices?.[0]?.text || "[No response]";
      setResponse(completion.trim());
    } catch (err) {
      console.error("Error:", err);
      setResponse("Error contacting VeridicAI backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">VeridicAI Web Interface</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="w-full p-4 rounded bg-zinc-800 border border-zinc-600 text-white focus:outline-none"
            rows={10}
            placeholder="Enter your VeridicAI prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Submit"}
          </button>
        </form>
        {response && (
          <div className="bg-zinc-900 p-4 rounded mt-4 whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-2">Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
