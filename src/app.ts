function autobind(
    _: any,
    _2 : string,
    descriptor: PropertyDescriptor
){
    const method = descriptor.value;
    const adjDescriptor : PropertyDescriptor = {
        configurable : true,
        get(){
           const bindedfn = method.bind(this);
           return bindedfn;            
        }
    };
    return adjDescriptor;
}

class InputData{
    templeteEl : HTMLTemplateElement;
    renderEL : HTMLDivElement;
    element:HTMLFormElement;

    projectTitleEl : HTMLInputElement;
    descriptionEl : HTMLInputElement;
    membersEl : HTMLInputElement;

    constructor(){
        
        this.templeteEl = document.getElementById("project-input")! as HTMLTemplateElement;
        this.renderEL = document.getElementById("app")! as HTMLDivElement;
        
        const importedTemplateNode = document.importNode(this.templeteEl.content,true);
        this.element = importedTemplateNode.firstElementChild! as HTMLFormElement;
        this.element.id = 'user-input'

        this.projectTitleEl = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionEl = this.element.querySelector('#description')! as HTMLInputElement
        this.membersEl = this.element.querySelector('#members')! as HTMLInputElement

        this.configSubmitEvent();


        this.attatch();
    }

    @autobind
    private submitHandler(event:Event){
        event.preventDefault();
        let temp = this.projectTitleEl.value;
        console.log(temp);
    }

    private configSubmitEvent(){
        this.element.addEventListener('submit',this.submitHandler;
    }

    private attatch(){
        this.renderEL.insertAdjacentElement('afterbegin',this.element)
    }
}

let testproject = new InputData();