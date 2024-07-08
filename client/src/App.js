import React, { useState, useEffect } from "react";
import axios from "axios";
import EventSelector from "./components/eventSelector";
import MemberList from "./components/memberList";
import AddMemberForm from "./components/AddMemberForm";
import SearchBar from "./components/SearchBar";

// Create an Axios instance with the correct backend URL
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

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const isWithinRange = (currentLocation, targetLocation, range = 0.1) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const distance =
      6371 *
      Math.acos(
        Math.cos(toRadians(currentLocation.latitude)) *
          Math.cos(toRadians(targetLocation.latitude)) *
          Math.cos(
            toRadians(targetLocation.longitude) -
              toRadians(currentLocation.longitude)
          ) +
          Math.sin(toRadians(currentLocation.latitude)) *
            Math.sin(toRadians(targetLocation.latitude))
      );
    return distance <= range;
  };

  const handleAttendanceChange = async (memberId, present) => {
    try {
      const currentLocation = await getCurrentLocation();
      const eventLocation = {
        latitude: selectedEvent.latitude,
        longitude: selectedEvent.longitude,
      };
      if (isWithinRange(currentLocation, eventLocation)) {
        const newAttendance = {
          ...attendance,
          [memberId]: present,
        };
        setAttendance(newAttendance);
        localStorage.setItem(
          `attendance_${selectedEvent._id}`,
          JSON.stringify(newAttendance)
        );
      } else {
        alert("You are not within the event location range.");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Failed to get your current location.");
    }
  };

  const handleSubmit = () => {
    const attendanceList = members.map((member) => ({
      email: member.email,
      present: attendance[member._id] || false,
    }));

    api
      .post("/api/attendance/mark", {
        eventId: selectedEvent._id,
        attendance: attendanceList,
      })
      .then(() => alert("Attendance submitted successfully!"))
      .catch((err) => console.error("Error submitting attendance:", err));
  };

  const handleMemberAdded = () => {
    // Re-fetch members to include the newly added member
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