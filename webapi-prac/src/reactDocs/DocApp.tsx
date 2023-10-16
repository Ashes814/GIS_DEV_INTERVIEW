import { useState, useRef } from "react";
// import AddTask from "./AddTask.js";
// import TaskList from "./TaskList.js";

export default function TaskApp() {
  // const [tasks, setTasks] = useState(initialTasks);

  // function handleAddTask(text) {
  //   setTasks([
  //     ...tasks,
  //     {
  //       id: nextId++,
  //       text: text,
  //       done: false,
  //     },
  //   ]);
  // }
  // function handleAddTask(text) {
  //   dispatchEvent({
  //     type: "added",
  //     id: nextId++,
  //     text: text,
  //   });
  // }

  // function handleChangeTask(task) {
  //   dispatch({
  //     type: "changed",
  //     task: task,
  //   });
  // }

  // function handleDeleteTask(taskId) {
  //   dispatch({
  //     type: "deleted",
  //     id: taskId,
  //   });
  // }
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    intervalRef.current = setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      {/* <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      /> */}
      <h1>Time Passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>start</button>
      <button onClick={handleStop}>stop</button>
    </>
  );
}

// let nextId = 3;
// const initialTasks = [
//   { id: 0, text: "Visit Kafka Museum", done: true },
//   { id: 1, text: "Watch a puppet show", done: false },
//   { id: 2, text: "Lennon Wall pic", done: false },
// ];
