import Note from "./Note";
import CONSTANTS from "../util/constants";
const COLUMN_OPTIONS = CONSTANTS.COLUMN_OPTIONS;

// All notes in column are same color 
// Only need start time and whether game is playing (ability to pause)
export default class Column {

  constructor(ctx, colNum, notifyMiss, logs, notifyStarted) {
    this.ctx = ctx;
    this.colNum = colNum;
    this.color = COLUMN_OPTIONS[colNum].COLOR;
    this.notifyMiss = notifyMiss;
    this.dimensions = {
      width: ctx.canvas.width,
      height: ctx.canvas.height
    }
    this.running = true;
    this.started = false;
    this.playing = false;
    this.allNotes = [];
    this.timeLogs = logs;
    this.startNotified = false;
    this.notifyStarted = notifyStarted;
    this.animate(ctx);
  }

  animate(ctx) {
    if (!this.started) {
      this.preloadNotes(ctx);
    } else if (this.playing){
      this.playColumn();
    }
    if (!this.requestedAnimation) {
      this.requestedAnimation = () => requestAnimationFrame(this.animate.bind(this));
    }
  }

  pauseColumn() {
    cancelAnimationFrame(this.requestedAnimation);
    this.requestedAnimation = () => requestAnimationFrame(this.animate.bind(this));
    this.playing = false;
    this.running = false;
  }

  playColumn() {
    requestAnimationFrame(this.requestedAnimation);
    this.playNotes();
    this.playing = true;
    this.running = true;
  }

  preloadNotes(ctx) {
    let allNotes = [];
    this.requestedAnimation = () => requestAnimationFrame(this.animate.bind(this));
    this.allNotes = allNotes;
    this.started = true;
    this.animate(ctx);
  }

  playNotes() {
    let newNotes = [];
    let newLogs = [];
    this.allNotes.forEach(note => {
      newNotes.push(note);
    });
    this.timeLogs.forEach(log => {
      if (window.audioPlayer.currentTime + 3.32 >= log) {
        let newNote = new Note(this.color, this);
        newNotes.push(newNote);
        if (!this.startNotified) {
          this.notifyStarted();
          this.startNotified = true;
        }
      } else {
        newLogs.push(log);
      }
    });
    this.timeLogs = newLogs;
    this.allNotes = newNotes;
    this.allNotes.forEach(note => {
      note.animate(this.ctx);
    });
    this.playing = true;
  }

  removeNote(rmNote) {
    let allNotes = [];
    this.allNotes.forEach(note => {
      if (note !== rmNote) {
        allNotes.push(note);
      }
    });
    this.ctx.clearRect(rmNote.x, rmNote.y, rmNote.dimensions.width, rmNote.dimensions.height);
    this.allNotes = allNotes;
  }

  removeMissedNote(missedNote) {
    this.notifyMiss();
    let allNotes = [];
    this.allNotes.forEach(note => {
      if (note !== missedNote) {
        allNotes.push(note);
      }
    });
    this.allNotes = allNotes;
  }
}
