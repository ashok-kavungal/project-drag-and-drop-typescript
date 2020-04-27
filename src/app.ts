interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus {
  'Active',
  'Completed'
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public members: number,
    public status: ProjectStatus
  ) {};
}


///state and change listener
type Listener < T > = (items: T[]) => void;

class State < T > {
  protected listeners: Listener < T > [] = [];

  addListener(listenerFn: Listener < T > ) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State < Project > {
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
    if (project && project.status !== status) {
      project.status == status;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

interface validateParams {
  value: string | number;
  mandatory ? : boolean;
  minlen ? : number;
  maxlen ? : number;
  min ? : number;
  max ? : number;
}

//validate function
function validate(toValidateData: validateParams) {
  let isvalid = true;
  if (toValidateData.mandatory) {
    isvalid = isvalid && toValidateData.value.toString().trim().length != 0;
  }

  if (typeof toValidateData.value === 'string' && toValidateData.minlen != null) {
    isvalid = isvalid && toValidateData.value.trim().length >= toValidateData.minlen
  }

  if (typeof toValidateData.value === 'string' && toValidateData.maxlen != null) {
    isvalid = isvalid && toValidateData.value.trim().length <= toValidateData.maxlen
  }

  if (typeof toValidateData.value === 'number' && toValidateData.min != null) {
    isvalid = isvalid && toValidateData.value >= toValidateData.min
  }

  if (typeof toValidateData.value === 'number' && toValidateData.max != null) {
    isvalid = isvalid && toValidateData.value <= toValidateData.max
  }
  return isvalid;
}

//autobind logic
function autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const bindedfn = method.bind(this);
      return bindedfn;
    }
  };
  return adjDescriptor;
}

//component abstract base class
abstract class Component < T extends HTMLElement, U extends HTMLElement > {

  templeteEl: HTMLTemplateElement;
  renderEL: T;
  element: U;

  constructor(
    templateElid: string,
    renderElid: string,
    attatchAfterBegin: boolean,
    elementId: string
  ) {
    this.templeteEl = document.getElementById(templateElid) !as HTMLTemplateElement;
    this.renderEL = document.getElementById(renderElid) !as T;

    const importedTemplateNode = document.importNode(this.templeteEl.content, true);
    this.element = importedTemplateNode.firstElementChild!as U;
    this.element.id = elementId;

    this.attatch(attatchAfterBegin);
  }

  private attatch(attatchAfterBegin: boolean) {
    this.renderEL.insertAdjacentElement(attatchAfterBegin ? 'afterbegin' : 'beforeend', this.element)
  }

  abstract configSubmitEvent(): void;
  abstract renderContent(): void;
}

class ProjectInfo extends Component < HTMLUListElement, HTMLLIElement > implements Draggable {
  private project: Project;

  get membors() {
    if (this.project.members === 1) {
      return "1 person";
    } else {
      return `${this.project.members} persons`;
    }
  }

  constructor(renderELid: string, project: Project) {
    super('single-project', renderELid, false, project.id);
    this.project = project;

    this.configSubmitEvent;
    this.renderContent();
    this.configDragtEvent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id); //copy id, fetch data from state
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  configDragtEvent() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  configSubmitEvent() {};

  renderContent() {
    this.element.querySelector('h2') !.textContent = this.project.title;
    this.element.querySelector('h3') !.textContent = this.membors + ' assigned';
    this.element.querySelector('p') !.textContent = this.project.description;
  }
}

//project list class
class ProjectList extends Component < HTMLDivElement, HTMLElement > implements DragTarget {
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


//form class
class InputData extends Component < HTMLDivElement, HTMLFormElement > {

  projectTitleEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  membersEl: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
    this.projectTitleEl = this.element.querySelector('#title') !as HTMLInputElement
    this.descriptionEl = this.element.querySelector('#description') !as HTMLInputElement
    this.membersEl = this.element.querySelector('#members') !as HTMLInputElement
    this.configSubmitEvent();
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const InputData = this.getValidatedData();
    if (Array.isArray(InputData)) {
      const [title, desc, membors] = InputData;
      projectState.addProject(title, desc, membors);
      this.clearInputs();
    }

  }
  private getValidatedData(): [string, string, number] | void {
    const title = this.projectTitleEl.value;
    const desc = this.descriptionEl.value;
    const memborNum = this.membersEl.value;

    const titleValidateParams: validateParams = {
      value: title,
      mandatory: true
    }
    const descValidateParams: validateParams = {
      value: desc,
      mandatory: true,
      minlen: 5,
      maxlen: 20
    }
    const memborValidateParams: validateParams = {
      value: +memborNum,
      mandatory: true,
      min: 1,
      max: 5
    }

    if (
      !validate(titleValidateParams) ||
      !validate(descValidateParams) ||
      !validate(memborValidateParams)
    ) {
      alert('invalid form inputs');
      return;
    } else {
      return [title, desc, +memborNum];
    }
  }

  private clearInputs() {
    this.projectTitleEl.value = '';
    this.descriptionEl.value = '';
    this.membersEl.value = '';
  }

  configSubmitEvent() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {};
}

let testproject = new InputData();
let active_projects = new ProjectList('active');
let completed_projects = new ProjectList('completed');
