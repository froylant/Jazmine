import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    course: "",
    age: "",
  });

  const loadStudents = () => {
    fetch("/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/students/${editingId}` : "/api/students";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to save student");
        }
        return data;
      })
      .then(() => {
        setForm({ name: "", course: "", age: "" });
        setEditingId(null);
        loadStudents();
      })
      .catch((error) => {
        console.error("Error saving student:", error);
      });
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      course: student.course,
      age: student.age,
    });
  };

  const handleDelete = (id) => {
    fetch(`/api/students/${id}`, {
      method: "DELETE",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to delete student");
        }
        return data;
      })
      .then(() => {
        loadStudents();
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", course: "", age: "" });
  };

  return (
    <main className="app-container">
      <section className="student-panel">
        <h1>Student Management</h1>

        <form className="student-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Student Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter student name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course</label>
            <input
              id="course"
              name="course"
              type="text"
              value={form.course}
              onChange={handleChange}
              placeholder="Enter course"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter age"
            />
          </div>

          <button type="submit" className="add-button">
            {editingId ? "Update Student" : "Add Student"}
          </button>

          {editingId && (
            <button type="button" className="cancel-button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="student-list-section">
        <h2>Student List</h2>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No student records found.</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id ?? `${student.name}-${student.course}`}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.age}</td>
                  <td className="action-cell">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default App;
