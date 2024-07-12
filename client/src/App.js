// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import EventSelector from "./components/eventSelector";
import MemberList from "./components/memberList";
import AddMemberForm from "./components/AddMemberForm";
import SearchBar from "./components/SearchBar";

const api = axios.create({
  baseURL: "https://rt-1a2q.onrender.com",
});

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api
      .get("/api/attendance/events")
      .then((res) => {
        console.log("Events fetched:", res.data);
        setEvents(res.data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      api
        .get("/api/attendance/members")
        .then((res) => {
          console.log("Members fetched:", res.data);
          setMembers(res.data);
          loadAttendanceState(selectedEvent);
        })
        .catch((err) => console.error("Error fetching members:", err));
    }
  }, [selectedEvent]);

  const loadAttendanceState = (eventId) => {
    const savedState = localStorage.getItem(`attendance_${eventId}`);
    if (savedState) {
      setAttendance(JSON.parse(savedState));
    } else {
      setAttendance({});
    }
  };

  const handleAttendanceChange = (memberId, present) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newAttendance = {
          ...attendance,
          [memberId]: present,
        };

        try {
          const membersWithId = Object.keys(newAttendance).map((id) => {
            const member = members.find((m) => m._id === id);
            if (!member) {
              throw new Error(`Member with id ${id} not found`);
            }
            return {
              email: member.email,
              present: newAttendance[id],
            };
          });

          await api.post("/api/attendance/mark", {
            eventId: selectedEvent,
            attendance: membersWithId,
            latitude,
            longitude,
          });
          alert("Attendance marked successfully!");
          setAttendance(newAttendance);
          localStorage.setItem(
            `attendance_${selectedEvent}`,
            JSON.stringify(newAttendance)
          );
        } catch (err) {
          console.error("Error marking attendance:", err);
          alert("Failed to mark attendance");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get your location");
      }
    );
  };

  const handleSubmit = () => {
    const attendanceList = members.map((member) => ({
      email: member.email,
      present: attendance[member._id] || false,
    }));

    api
      .post("/api/attendance/mark", {
        eventId: selectedEvent,
        attendance: attendanceList,
      })
      .then(() => {
        api
          .post("/api/attendance/sendEmails", { eventId: selectedEvent, attendance: attendanceList })
          .then(() => alert("Attendance submitted and emails sent successfully!"))
          .catch((err) => {
            console.error("Error sending emails:", err);
            alert("Failed to send emails");
          });
      })
      .catch((err) => {
        console.error("Error submitting attendance:", err);
        alert("Failed to submit attendance");
      });
  };

  const handleMemberAdded = () => {
    if (selectedEvent) {
      api
        .get("/api/attendance/members")
        .then((res) => {
          setMembers(res.data);
        })
        .catch((err) => console.error("Error fetching members:", err));
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
          Rotary Club Attendance
        </h1>
        <EventSelector events={events} onSelect={setSelectedEvent} />
        <SearchBar onSearch={setSearchTerm} />
        {selectedEvent && (
          <div className="mt-4">
            <AddMemberForm onMemberAdded={handleMemberAdded} />
            <MemberList
              members={filteredMembers}
              attendance={attendance}
              onAttendanceChange={handleAttendanceChange}
            />
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Send Attendance Emails
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;