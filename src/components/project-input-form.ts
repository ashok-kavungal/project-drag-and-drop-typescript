import Component from './base-component';
import * as validate from '../utils/validate';
import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';

export class InputData extends Component < HTMLDivElement, HTMLFormElement > {

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
  
      const titleValidateParams: validate.validateParams = {
        value: title,
        mandatory: true
      }
      const descValidateParams: validate.validateParams = {
        value: desc,
        mandatory: true,
        minlen: 5,
        maxlen: 20
      }
      const memborValidateParams: validate.validateParams = {
        value: +memborNum,
        mandatory: true,
        min: 1,
        max: 5
      }
  
      if (
        !validate.validate(titleValidateParams) ||
        !validate.validate(descValidateParams) ||
        !validate.validate(memborValidateParams)
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