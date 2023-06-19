import * as model from "./model.js";
import newProject from "./views/newProject.js";
import editProject from "./views/editProject.js";
import newTask from "./views/newTask.js";
import editTask from "./views/editTask.js";
import { create } from "lodash";

// ============= Projects ============= //
const controlNewProject = function () {
  // Generate HTML Markup for element and add it to model projects list.
  const elementHTML = newProject.generateMarkup(model.createProject());
  // Make Add new project element to HTML structure
  const projectEl = newProject.addElementHTML(elementHTML);
  const nameFieldEl = editProject.selectProjectName(projectEl);
  // Focus name input field of created project, so it can be edited
  editProject.focusElement(nameFieldEl);
  // Make "Add new Task" Button working in newly created project
  controlNewTaskBtn(projectEl);
  // Make Project Name editable.
  editProject.editInput(nameFieldEl);
};

// const controlEditProjectName = function (nameInput) {
//   editProject.editInput(nameInput);
// };

// Store every edit of Project Name
const controlStoreProjectName = function (nameInput) {
  model.updateProjectName(nameInput, editProject.getProjectId(nameInput));
};

// ============= Tasks ============= //

const controlNewTaskBtn = function (project) {
  // console.log(project);
  // const newTaskBtn = project.querySelector(".button_add_new_task");
  newTask.addHandler(controlNewTask, project);
};

const controlNewTask = function (projectId) {
  const elementHTML = newTask.generateMarkup(model.createTask(projectId));
  const taskEl = newTask.addElementHTML(elementHTML);
  const taskNameEl = editTask.selectTaskName(taskEl);
  controlEditTaskName(taskNameEl);
};

const controlEditTaskName = function (taskNameEl) {
  editTask.editInput(taskNameEl);
};

const controlStoreTaskName = function (taskNameEl) {
  const data = editTask.getTaskData(taskNameEl);
  model.editTask(data.id, data);
};

// ============= Initialization function ============= //

const init = function () {
  newProject.addHandler(controlNewProject);
  editProject.addUpdateHandler(controlStoreProjectName);
  editTask.addUpdateHandler(controlStoreTaskName);
  // NewProject.selectElement(".projects-container", ".project-name");
};
init();
