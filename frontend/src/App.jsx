import Header from "./Header";
import { Routes, Route } from "react-router-dom";
import CourseList from "./CourseList";
import CourseDetails from "./CourseDetails";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
      </Routes>
    </div>
  );
}

export default App;
