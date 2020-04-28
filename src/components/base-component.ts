//component abstract base class
export default abstract class Component < T extends HTMLElement, U extends HTMLElement > {

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