import Component from './base-component.js';
import ProjectInfo from './project-info.js'
import { DragTarget} from '../model/drag-drop.js'
import { autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import {Project,ProjectStatus} from '../model/project.js'

//project list class
export class ProjectList extends Component < HTMLDivElement, HTMLElement > implements DragTarget {
    private projects: Project[];
  
    constructor(private listType: 'active' | 'completed') {
      super('project-list', 'app', false, `${listType}-projects`);
      this.projects = [];
  
      this.configSubmitEvent();
      this.configDragEvent();
      this.renderContent();
    }
  
    configSubmitEvent() {
      projectState.addListener((projects: Project[]) => {
  
        const relevantProjects = projects.filter(prj => {
          if (this.listType === 'active') {
            return prj.status === ProjectStatus.Active;
          }
          return prj.status === ProjectStatus.Completed;
        });
        this.projects = relevantProjects;
        this.renderProjects();
      });
    };
  
    @autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
        event.preventDefault();
        const listEl = this.element.querySelector('ul') !;
        listEl.classList.add('droppable');
      }
    }
  
    dropHandler(event: DragEvent) {
      const projectId = event.dataTransfer!.getData('text/plain');
      projectState.moveToCompleted(
        projectId,
        this.listType === 'active' ? ProjectStatus.Active : ProjectStatus.Completed
      );
    }
  
    @autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector('ul') !;
      listEl.classList.remove('droppable');
    }
  
    configDragEvent() {
  
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);
      this.element.addEventListener('drop', this.dropHandler);
    }
  
    renderContent() {
      const listId = `${this.listType}-projects-list`;
      this.element.querySelector('ul') !.id = listId;
      this.element.querySelector('h2') !.textContent = this.listType.toUpperCase() + ' PROJECTS';
    }
  
    private renderProjects() {
      const listEl = document.getElementById(`${this.listType}-projects-list`) !as HTMLUListElement;
      listEl.innerHTML = '';
      for (const prjItem of this.projects) {
        new ProjectInfo(this.element.querySelector('ul') !.id, prjItem);
      }
    }
  }
  