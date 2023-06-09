import * as model from "./model.js";
import { create } from "lodash";
import newProject from "./views/newProject.js";
import editProject from "./views/editProject.js";
import newTask from "./views/newTask.js";
import editTask from "./views/editTask.js";
import stateTask from "./views/stateTask.js";
import manageContent from "./views/manageContent.js";
import detailsTask from "./views/detailsTask.js";
import deleteTask from "./views/deleteTask.js";
import styleProject from "./views/styleProject.js";

// ============= Project Settings ============= //
const controlNewProject = function (loaded = undefined) {
  // Generate HTML Markup for element and add it to model projects list.
  const elementHTML = newProject.generateMarkup(model.createProject(loaded));
  // Make Add new project element to HTML structure
  const projectEl = newProject.addElementHTML(elementHTML);
  controlProjectColor(projectEl, elementHTML.data.color);
  const nameFieldEl = editProject.selectProjectName(projectEl);
  // Focus name input field of created project, so it can be edited
  editProject.focusElement(nameFieldEl);
  // Make "Add new Task" Button working in newly created project
  controlNewTaskBtn(projectEl, true);
  // Make Project Name editable.
  editProject.editInput(nameFieldEl);
};

// Store every edit of Project Name
const controlStoreProjectName = function (nameInput) {
  model.updateProjectName(nameInput, editProject.getProjectId(nameInput));
  model.saveProjects();
};

// Display Project Options
const controlProjectOptions = function (ev) {
  if (ev.target.classList.contains(`${styleProject.pIcon}`)) {
    controlProjectIcon(ev);
  }
  if (ev.target.classList.contains(`${styleProject.pMenu}`)) {
    styleProject.openMenu(ev.target, controlProjectColor, controlDeleteProject);
  }
};

// Change project color
const controlProjectColor = function (ev, color) {
  if (!ev.target) {
    styleProject.changeColor(ev, color);
  } else {
    console.log();
    styleProject.changeColor(
      ev.target,
      model.changeProjectColor(ev.target.closest(".project").dataset.id)
    );
    model.saveProjects();
  }
};

// Change project Icon
const controlProjectIcon = function (ev, icon) {
  if (!ev.target) {
    styleProject.changeIcon(ev, icon);
  } else {
    console.log();
    styleProject.changeIcon(
      ev.target,
      model.changeProjectIcon(ev.target.closest(".project").dataset.id).iconName
    );
    model.saveProjects();
  }
};

// Remove Project
const controlDeleteProject = function (ev, projectEl) {
  model.removeProject(projectEl.dataset.id);
  model.saveProjects();
};

// ============= Tasks Settings ============= //

const controlNewTaskBtn = function (project) {
  newTask.addHandler(controlNewTask, project);
};

const controlNewTask = function (projectId, loadedTask = undefined) {
  const elementHTML = newTask.generateMarkup(
    model.createTask(projectId, loadedTask)
  );

  const taskEl = newTask.addElementHTML(
    elementHTML,
    loadedTask ? loadedTask : undefined
  );
  const taskNameEl = editTask.selectTaskName(taskEl);
  if (loadedTask && loadedTask.done === true) {
    stateTask.toggleTaskCheckbox(taskEl.querySelector(".checkbox"));
  }
  controlEditTaskName(taskNameEl);
  model.saveProjects();
};

const controlEditTaskName = function (taskNameEl) {
  editTask.editInput(taskNameEl, 30);
};

const controlTaskPanel = function (clicked) {
  // Store clicked task Element
  const clickedTask = clicked.target.closest(".task");
  // Add task-panel to secondary panel
  manageContent.changePanel(
    "secondary",
    manageContent.chooseSubPanel("task-panel")
  );
  // Remove hidden class from Second Panel
  controlSecondPanel("show");
  controlTaskDataDetails(clickedTask);
};

const controlTaskDataDetails = function (task) {
  const taskPanelEl = manageContent.secondaryPanel.querySelector(".task-panel");
  detailsTask.changeParentEl(taskPanelEl);
  const taskId = editTask.getTaskId(task);

  const taskData = model.findTask(taskId);
  const elementHTML = detailsTask.generateMarkup(taskData);
  const taskDetailsEl = detailsTask.addElementHTML(elementHTML, taskPanelEl);
  const elements = detailsTask.selectAllElements();
  // Listen to changes of name or description
  detailsTask.editInput(elements.text);
  detailsTask.editDesc(elements.desc);
  // Change Secondary Panel border color to match Tasks project Color
  detailsTask.changeBorderColor(
    manageContent.secondaryPanel,
    model.findProjectOfTask(task.dataset.id).color
  );
};

// ============= Panels Settings ============= //

const controlSecondPanel = function (whatToDo) {
  manageContent.elementVisibility(manageContent.secondaryPanel, whatToDo);
};

const controlStoreTaskData = function (taskNameEl) {
  let data;
  if (taskNameEl.classList.contains("task-desc")) {
    data = detailsTask.getTaskData(taskNameEl);
  } else {
    data = editTask.getTaskData(taskNameEl, model.findTask);
  }
  updateVisibleTaskData(data);
  model.editTask(data.id, data);
  model.saveProjects();
};

const updateVisibleTaskData = function (data) {
  if (typeof data === Number)
    data = {
      id: data,
    };
  const bothTaskEl = document.querySelectorAll(`[data-id="${data.id}"]`);
  bothTaskEl.forEach(
    (taskEl) => (taskEl.querySelector(".task_text").textContent = data.taskName)
  );
};

const controlDeleteTask = function (event) {
  const data = deleteTask.clearTaskData(event.target);
  const newData = {
    id: "",
    taskName: undefined,
    description: undefined,
    done: undefined,
  };
  // model.editTask(data.id, newData);
  model.removeTaskFromProject(data.id);
  model.saveProjects();
};

// Loading & Rendering

const renderProjects = function (loadedProjects) {
  loadedProjects.forEach((project) => {
    controlNewProject(project);
    renderTasks(project, project.tasks);
  });
};

const renderTasks = function (project, loadedTasks) {
  loadedTasks.forEach((task) => controlNewTask(project.id, task));
};

// ============= Initialization function ============= //

const init = function () {
  newProject.addHandler(controlNewProject);
  editProject.addUpdateHandler(controlStoreProjectName);
  editTask.addUpdateHandler(controlStoreTaskData);
  detailsTask.addUpdateHandler(controlStoreTaskData);
  stateTask.checkboxListener();
  stateTask.addUpdateHandler(controlStoreTaskData);
  // Listen to task clicking, so the event can be used later.
  editTask.listenToClass(["task-text", "task"], ".projects-container");
  editTask.addListenerHandler(controlTaskPanel);
  deleteTask.addListenerHandler(controlDeleteTask);
  deleteTask.listenToClass(["task-delete"], ".app");
  styleProject.listenToClass(
    ["project-menu", "project-icon"],
    ".projects-container"
  );
  styleProject.addListenerHandler(controlProjectOptions);
  renderProjects(model.loadProjects());
};
init();
