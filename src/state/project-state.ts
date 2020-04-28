import { Project, ProjectStatus } from '../model/project';

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

  moveToCompleted(id: string, newStatus: ProjectStatus) {
    const project = this.projects.find(p => p.id === id);
    console.log("project found with status"+ project?.status +"the new status is"+newStatus);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      console.log('the changed status is'+ project.status);
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