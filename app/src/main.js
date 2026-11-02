/**
 * main.js — Application entry point.
 *
 * Responsibilities (Phase 1: smoke test only):
 * - Mount the application shell into #app.
 * - In later phases this will import and initialise all modules.
 */

import "./style.css";
import { createApp } from "./app.js";

createApp(document.getElementById("app"));
