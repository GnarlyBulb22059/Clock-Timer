import { useEffect, useRef, useState } from 'react'
import beepSound from './A3TMECN-beep.mp3';
import './App.css'

function App() {
  const [breaklength, setBreaklength] = useState(5);
  const [sessionlength, setSessionlength] = useState(25);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [sessionType, setSessionType] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current !== null) {
      if (isCompleted) {
        audioRef.current.play();
      }
    }
  }, [isCompleted]);
  const lengthTime = (statement: string) => {
    if (sessionType === "Session") {
      if (statement === "break-decrement") {
        if (breaklength == 1) {
          return;
        }
        else {
          setBreaklength(breaklength - 1);
        }
      }
      else if (statement === "break-increment") {
        if (breaklength == 60) {
          return;
        }
        else {
          setBreaklength(breaklength + 1);
        }
      }
      else if (statement === "session-decrement") {
        if (sessionlength == 1) {
          return;
        }
        else {
          setSessionlength(sessionlength - 1);
          setMinutes(sessionlength - 1);
        }
      }
      else if (statement === "session-increment") {
        if (sessionlength == 60) {
          return;
        }
        else {
          setSessionlength(sessionlength + 1);
          setMinutes(sessionlength + 1);
        }
      }
    }
    else if (sessionType === "Break") {
      if (statement === "break-decrement") {
        if (breaklength == 1) {
          return;
        }
        else {
          setBreaklength(breaklength - 1);
          setMinutes(breaklength - 1);
        }
      }
      else if (statement === "break-increment") {
        if (breaklength == 60) {
          return;
        }
        else {
          setBreaklength(breaklength + 1);
          setMinutes(breaklength + 1);
        }
      }
      else if (statement === "session-decrement") {
        if (sessionlength == 1) {
          return;
        }
        else {
          setSessionlength(sessionlength - 1);
        }
      }
      else if (statement === "session-increment") {
        if (sessionlength == 60) {
          return;
        }
        else {
          setSessionlength(sessionlength + 1);
        }
      }
    }
  }
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Switch to break or work session
            setSessionType(sessionType === 'Session' ? 'Break' : 'Session');
            setMinutes(sessionType === 'Session' ? breaklength : sessionlength);
            setIsCompleted(true);
          }
          else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
        else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    else {
      clearInterval(interval);
      setIsCompleted(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, sessionType])
  const reset = () => {
    setMinutes(25);
    setSeconds(0);
    setSessionlength(25);
    setBreaklength(5);
    setIsRunning(false);
    setSessionType('Session');
    if (audioRef.current !== null) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const startStopTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <>
      <div id="container">
        <h1>25 + 5 Clock</h1>
        <div id="labels">
          <div id="break-label">Break Length:
            <div id="buttons">
              <button id="break-decrement" onClick={() => lengthTime("break-decrement")}>decrement</button>
              <button id="break-increment" onClick={() => lengthTime("break-increment")}>increment</button>
            </div>
            <div id="break-length">{breaklength}</div>
          </div>
          <div id="session-label">Session Length:
            <div id="buttons">
              <button id="session-decrement" onClick={() => lengthTime("session-decrement")}>decrement</button>
              <button id="session-increment" onClick={() => lengthTime("session-increment")}>increment</button>
            </div>
            <div id="session-length">{sessionlength}</div>
          </div>
        </div>
        <div id="timer-label">{sessionType} :
          <div id="time-left">{minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}</div>
          <button id="start_stop" onClick={() => startStopTimer()}>start_stop</button>
          <button id="reset" onClick={() => reset()}>reset</button>
          <audio ref={audioRef} src={beepSound} id='beep' />
        </div>
      </div>
    </>
  )
}

export default App
