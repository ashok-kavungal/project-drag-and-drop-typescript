import { Draggable} from '../model/drag-drop.js'
import Component from './base-component.js';
import { autobind } from '../decorators/autobind.js';
import {Project} from '../model/project.js'

export default class ProjectInfo extends Component < HTMLUListElement, HTMLLIElement > implements Draggable {
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