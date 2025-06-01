import { useState } from "react";

function App() {
  const [car, setCar] = useState({
    make: "",
    model: "",
    year: "",
    problem: "",
  });

  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [troubleshooting, setTroubleshooting] = useState("");
  const [replacementParts, setReplacementParts] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDiagnosis("");
    setTroubleshooting("");
    setReplacementParts([]);
    setTutorials([]);
    setError("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car),
      });

      if (!response.ok) throw new Error("Backend request failed.");

      const data = await response.json();
      setDiagnosis(data.diagnosis || "");
      setTroubleshooting(data.troubleshootingSteps || "");
      setReplacementParts(data.replacementParts || []);
      setTutorials(data.tutorials || []);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">🧙‍♂️ CarWizard</h1>
        <p className="mb-6 text-center text-gray-300">
          Enter your car details and the problem you’re facing:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="make"
            placeholder="Car Make (e.g. Toyota)"
            value={car.make}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            name="model"
            placeholder="Car Model (e.g. Corolla)"
            value={car.model}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="number"
            name="year"
            placeholder="Year (e.g. 2025)"
            value={car.year}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            name="problem"
            placeholder="Describe the issue you're facing"
            value={car.problem}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded transition duration-300"
          >
            {loading ? "Analyzing..." : "Get Diagnosis"}
          </button>
        </form>

        {diagnosis && diagnosis.length > 0 && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg text-sm whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">🛠 Diagnosis</h2>
            {diagnosis}
          </div>
        )}

        {troubleshooting && troubleshooting.length > 0 && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg text-sm">
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">🔧 Troubleshooting Steps (Before Replacing Parts)</h2>
            <ol className="list-decimal list-inside space-y-1">
              {troubleshooting.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {replacementParts.length > 0 && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg text-sm">
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">🛒 Replacement Parts (If Troubleshooting Didn't Work)</h2>
            <ul className="list-disc list-inside space-y-1">
              {replacementParts.map((part, index) => (
                <li key={index}>
                  <a
                    href={part.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {part.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tutorials.length > 0 && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg text-sm">
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">🎥 YouTube How-to Videos</h2>
            <ul className="list-disc list-inside space-y-1">
              {tutorials.map((video, index) => (
                <li key={index}>
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {video.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-600 text-white rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
