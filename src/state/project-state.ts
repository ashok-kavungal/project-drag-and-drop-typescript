import { Project, ProjectStatus } from '../model/project.js';

///state and change listener
type Listener <T> = (items: T[]) => void;

class State <T> {
  protected listeners: Listener <T>[] = [];

  addListener(listenerFn: Listener <T> ) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State <Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfMembers: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfMembers,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveToCompleted(id: string, status: ProjectStatus) {
    const project = this.projects.find(p => p.id === id);
    console.log(project);
    if (project && project.status !== status) {
      project.status = status;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();