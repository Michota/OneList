import View from "./view.js";

class EditTask extends View {
  _data;
  _parentElement = ".task_text";
  _taskNameEl = ".task_text";

  selectTaskName(taskEl) {
    const taskName = taskEl.querySelector(this._taskNameEl);
    return taskName;
  }

  getTaskId(element) {
    const taskEl = element.closest(".task");
    return Number(taskEl.dataset.id);
  }

  getTaskData = function (element) {
    const data = {
      id: this.getTaskId(element),
      taskName: element.closest(this._taskNameEl).textContent,
    };
    return data;
  };
}

export default new EditTask();
