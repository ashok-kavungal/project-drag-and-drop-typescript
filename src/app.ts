class InputData{
    templeteEl : HTMLTemplateElement;
    renderEL : HTMLDivElement;
    element:HTMLFormElement;

    constructor(){
        this.templeteEl = document.getElementById("project-input")! as HTMLTemplateElement;
        this.renderEL = document.getElementById("app")! as HTMLDivElement;
        
        const importedTemplateNode = document.importNode(this.templeteEl.content,true);
        this.element = importedTemplateNode.firstElementChild! as HTMLFormElement
        this.attatch();
    }

    private attatch(){
        this.renderEL.insertAdjacentElement('afterbegin',this.element)
    }
}

let testproject = new InputData();