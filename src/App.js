// App.js

import React, { useState, useRef } from 'react';
import './App.css'; // Import custom CSS for styling

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState('Session');

  const audioRef = useRef(null);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return (
      String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
    );
  };

  const handleStartStop = () => {
    if (timerRunning) {
      clearInterval(timer);
      setTimerRunning(false);
    } else {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            audioRef.current.play();
            if (timerType === 'Session') {
              setTimerType('Break');
              setTimeLeft(breakLength * 60);
            } else {
              setTimerType('Session');
              setTimeLeft(sessionLength * 60);
            }
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);
      setTimerRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(timer);
    setTimerRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerType('Session');
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleIncrement = (type) => {
    if (type === 'Break' && breakLength < 60) {
      setBreakLength((prevLength) => prevLength + 1);
    } else if (type === 'Session' && sessionLength < 60) {
      setSessionLength((prevLength) => prevLength + 1);
      setTimeLeft((prevTimeLeft) => prevTimeLeft + 60);
    }
  };

  const handleDecrement = (type) => {
    if (type === 'Break' && breakLength > 1) {
      setBreakLength((prevLength) => prevLength - 1);
    } else if (type === 'Session' && sessionLength > 1) {
      setSessionLength((prevLength) => prevLength - 1);
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 60);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">25 + 5 Clock</h1>
      <div className="clock-container">
        <div className="break-container">
          <div id="break-label" className="label">
            Break Length
          </div>
          <button
            id="break-decrement"
            className="btn btn-secondary"
            onClick={() => handleDecrement('Break')}
          >
            -
          </button>
          <div id="break-length" className="length">
            {breakLength}
          </div>
          <button
            id="break-increment"
            className="btn btn-secondary"
            onClick={() => handleIncrement('Break')}
          >
            +
          </button>
        </div>
        <div className="session-container">
          <div id="session-label" className="label">
            Session Length
          </div>
          <button
            id="session-decrement"
            className="btn btn-secondary"
            onClick={() => handleDecrement('Session')}
          >
            -
          </button>
          <div id="session-length" className="length">
            {sessionLength}
          </div>
          <button
            id="session-increment"
            className="btn btn-secondary"
            onClick={() => handleIncrement('Session')}
          >
            +
          </button>
        </div>
      </div>
      <div id="timer-label" className="text-center mt-4">
        {timerType}
      </div>
      <div id="time-left" className="time-display text-center">
        {formatTime(timeLeft)}
      </div>
      <div className="controls text-center mt-4">
        <button id="start_stop" className="btn btn-primary" onClick={handleStartStop}>
          {timerRunning ? 'Pause' : 'Start'}
        </button>
        <button id="reset" className="btn btn-danger" onClick={handleReset}>
          Reset
        </button>
      </div>
      <audio
        id="beep"
        src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        ref={audioRef}
      />
    </div>
  );
};

export default App;
