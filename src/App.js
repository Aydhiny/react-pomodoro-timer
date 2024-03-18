import React, { useState, useRef } from 'react';
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState('Session');
  const audioElement = useRef(null);
  const timer = useRef(null);

  const decrementBreakLength = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const incrementBreakLength = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!timerRunning) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!timerRunning) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const toggleTimer = () => {
    if (!timerRunning) {
      setTimerRunning(true);
      timer.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            audioElement.current.play();
            clearInterval(timer.current);
            if (timerType === 'Session') {
              setTimerType('Break');
              setTimeLeft(breakLength * 60);
              timer.current = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                  if (prevTimeLeft === 0) {
                    audioElement.current.play();
                    clearInterval(timer.current);
                    setTimerType('Session');
                    setTimeLeft(sessionLength * 60);
                    setTimerRunning(false);
                  }
                  return prevTimeLeft - 1;
                });
              }, 1000);
            }
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer.current);
      setTimerRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(timer.current);
    setTimerRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerType('Session');
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
  };

  return (
    <div className="App">
      <p className='fixed-logo'>Ajdin Mehmedović</p>
      <div id="break-label">
        <h2>Break Length</h2>
        <button id="break-decrement" onClick={decrementBreakLength}>-</button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={incrementBreakLength}>+</button>
      </div>
      <div id="session-label">
        <h2>Session Length</h2>
        <button id="session-decrement" onClick={decrementSessionLength}>-</button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-increment" onClick={incrementSessionLength}>+</button>
      </div>
      <div id="timer-label">
        <h2>{timerType}</h2>
        <span id="time-left">{`${Math.floor(timeLeft / 60)
          .toString()
          .padStart(2, '0')}:${(timeLeft % 60)
          .toString()
          .padStart(2, '0')}`}</span>
      </div>
      <button id="start_stop" onClick={toggleTimer}>Start/Stop</button>
      <button id="reset" onClick={resetTimer}>Reset</button>
      <audio
        id="beep"
        src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        ref={audioElement}
      ></audio>
    </div>
  );
};

export default App;
