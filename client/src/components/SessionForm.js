import { useState } from "react";
import { usePOTDContext } from "../hooks/usePOTDContext";

const SessionForm = () => {
  const { dispatch } = usePOTDContext()

  const [eventName, setName] = useState("");
  // const [allProblems, setProblems] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = { eventName };

    const response = await fetch("http://localhost:4000/archive/create", {
      method: "POST",
      body: JSON.stringify(session),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setName("");
      // setProblems("");
      dispatch({type: 'CREATE_POTD', payload: json})
      console.log("New Session has been added:", json);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Session</h3>

      <label>Session Name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={eventName}
      />
      <br />

      {/* <label>Problems:</label>
      <input
        type="text"
        onChange={(e) => setProblems(e.target.value)}
        value={allProblems}
      />
      <br /> */}

      <button>Add Session</button>
      <br />
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default SessionForm;
