
import { useState } from "react";
import "./BloodRequest.css";

export default function BloodRequest() {
  const [form, setForm] = useState({
    requester_name: "",
    blood_group: "",
    units_required: "1",
    hospital_name: "",
    hospital_address: "",
    contact_phone: "",
    urgency: "urgent",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/blood-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            units_required: Number(form.units_required),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      setMessage(
        `Blood request submitted successfully! Request ID: ${result.request_id}`
      );

      setForm({
        requester_name: "",
        blood_group: "",
        units_required: "1",
        hospital_name: "",
        hospital_address: "",
        contact_phone: "",
        urgency: "urgent",
      });
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that Flask is running."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="blood-request">
      <h2>Request Blood</h2>
      <p>Submit an emergency blood requirement through RaktaSync.</p>

      <form onSubmit={handleSubmit}>
        <label>Your Name</label>
        <input
          name="requester_name"
          value={form.requester_name}
          onChange={handleChange}
          placeholder="Enter your name"
          maxLength={100}
          required
        />

        <label>Required Blood Group</label>
        <select
          name="blood_group"
          value={form.blood_group}
          onChange={handleChange}
          required
        >
          <option value="">Select blood group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
            (group) => (
              <option key={group} value={group}>{group}</option>
            )
          )}
        </select>

        <label>Units Required</label>
        <input
          type="number"
          name="units_required"
          min="1"
          max="100"
          value={form.units_required}
          onChange={handleChange}
          required
        />

        <label>Hospital Name</label>
        <input
          name="hospital_name"
          value={form.hospital_name}
          onChange={handleChange}
          placeholder="Enter hospital name"
          maxLength={150}
          required
        />

        <label>Hospital Address</label>
        <textarea
          name="hospital_address"
          value={form.hospital_address}
          onChange={handleChange}
          placeholder="Enter hospital address"
          required
        />

        <label>Contact Phone</label>
        <input
          type="tel"
          name="contact_phone"
          value={form.contact_phone}
          onChange={handleChange}
          placeholder="Enter contact number"
          maxLength={15}
          required
        />

        <label>Urgency</label>
        <select
          name="urgency"
          value={form.urgency}
          onChange={handleChange}
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="critical">Critical</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Blood Request"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </section>
  );
}
