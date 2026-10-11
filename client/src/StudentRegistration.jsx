
import { useState } from "react";

export default function StudentRegistration() {
  const [form, setForm] = useState({
    full_name: "",
    college_email: "",
    phone: "",
    blood_group: "",
    is_donor: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setMessage(
        `Registration successful! Student ID: ${result.student_id}`
      );

      setForm({
        full_name: "",
        college_email: "",
        phone: "",
        blood_group: "",
        is_donor: false,
      });
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure Flask is running."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="registration">
      <h2>Student Registration</h2>
      <p>Join RaktaSync and help connect blood donors with students in need.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          maxLength={100}
          placeholder="Enter your full name"
        />

        <label htmlFor="college_email">College Email</label>
        <input
          id="college_email"
          name="college_email"
          type="email"
          value={form.college_email}
          onChange={handleChange}
          required
          maxLength={150}
          placeholder="Enter your college email"
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          maxLength={15}
          placeholder="Enter your phone number"
        />

        <label htmlFor="blood_group">Blood Group</label>
        <select
          id="blood_group"
          name="blood_group"
          value={form.blood_group}
          onChange={handleChange}
          required
        >
          <option value="">Select blood group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
            (group) => (
              <option key={group} value={group}>
                {group}
              </option>
            )
          )}
        </select>

        <label className="donor-option">
          <input
            type="checkbox"
            name="is_donor"
            checked={form.is_donor}
            onChange={handleChange}
          />
          I want to register as a blood donor
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </section>
  );
}
