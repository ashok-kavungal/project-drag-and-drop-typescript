interface validateParams{
    value: string | number;
    mandatory?: boolean;
    minlen?: number;
    maxlen?: number;
    min?: number;
    max?:number;
}

//validate function
function validate(toValidateData: validateParams){
    let isvalid = true;
    if(toValidateData.mandatory){
        isvalid = isvalid && toValidateData.value.toString().trim().length != 0;
    }

    if(typeof toValidateData.value ==='string' && toValidateData.minlen != null){
        isvalid = isvalid &&  toValidateData.value.trim().length >= toValidateData.minlen
    }

    if(typeof toValidateData.value ==='string' && toValidateData.maxlen != null){
        isvalid = isvalid &&  toValidateData.value.trim().length <= toValidateData.maxlen
    }
    
    if(typeof toValidateData.value ==='number' && toValidateData.min != null){
        isvalid = isvalid &&  toValidateData.value >= toValidateData.min
    }

    if(typeof toValidateData.value ==='number' && toValidateData.max!= null){
        isvalid = isvalid &&  toValidateData.value <= toValidateData.max
    }
    return isvalid;
}

//autobind logic
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


//component abstract base class

class Component <T extends HTMLElement, U extends HTMLElement>{

    templeteEl : HTMLTemplateElement;
    renderEL : T;
    element: U;

    constructor(
        templateElid:string,
        renderElid:string,
        attatchAfterBegin:boolean,
        elementId:string        
    ){
        this.templeteEl = document.getElementById(templateElid)! as HTMLTemplateElement;
        this.renderEL = document.getElementById(renderElid)! as T;
        
        const importedTemplateNode = document.importNode(this.templeteEl.content,true);
        this.element = importedTemplateNode.firstElementChild! as U;
        this.element.id = elementId;

        this.attatch(attatchAfterBegin);
    }

    private attatch(attatchAfterBegin : boolean){
        this.renderEL.insertAdjacentElement( attatchAfterBegin ? 'afterbegin':'beforeend',this.element)
    }
}

//project list class
/*class ProjectList{

    templeteEl : HTMLTemplateElement;
    renderEL : HTMLDivElement;
    element:HTMLElement;

    constructor(private listType : 'active'| 'completed'){
        this.templeteEl = document.getElementById("project-list")! as HTMLTemplateElement;
        this.renderEL = document.getElementById("app")! as HTMLDivElement;
        
        const importedTemplateNode = document.importNode(this.templeteEl.content,true);
        this.element = importedTemplateNode.firstElementChild! as HTMLElement;
        this.element.id = `${listType}-projects`;

        this.attatch();
        this.renderContent();

    }

    private attatch(){
        this.renderEL.insertAdjacentElement('beforeend',this.element)
    }

    private renderContent(){
        const listId = `${this.listType}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.listType.toUpperCase() + ' PROJECTS';
    }
}
*/

//form class
class InputData extends Component <HTMLDivElement,HTMLFormElement>{
  

    projectTitleEl : HTMLInputElement;
    descriptionEl : HTMLInputElement;
    membersEl : HTMLInputElement;

    constructor(){
        super('project-input','app',true,'user-input');
        this.projectTitleEl = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionEl = this.element.querySelector('#description')! as HTMLInputElement
        this.membersEl = this.element.querySelector('#members')! as HTMLInputElement
        this.configSubmitEvent();
    }

    @autobind
    private submitHandler(event:Event){
        event.preventDefault();
        const InputData = this.getValidatedData();
        if(Array.isArray(InputData)){
            const [title,desc,membors] = InputData;
            console.log(title,desc,membors);
            this.clearInputs();
        }

    }
    private getValidatedData():[string,string,number]|void{
        const title = this.projectTitleEl.value;
        const desc = this.descriptionEl.value;
        const memborNum = this.membersEl.value;
        
        const titleValidateParams : validateParams = {
            value: title,
            mandatory: true
        }
        const descValidateParams : validateParams = {
            value: desc,
            mandatory: true,
            minlen : 5,
            maxlen : 20
        }
        const memborValidateParams : validateParams = {
            value: +memborNum,
            mandatory: true,
            min:1,
            max:5
        }

        if(
            !validate(titleValidateParams) ||
            !validate(descValidateParams) ||
            !validate(memborValidateParams)
        ){
            alert('invalid form inputs');
            return;
        }else{
            return [ title,desc,+memborNum];
        }
    }

    private clearInputs() {
        this.projectTitleEl.value = '';
        this.descriptionEl.value = '';
        this.membersEl.value = '';
      }

    private configSubmitEvent(){
        this.element.addEventListener('submit',this.submitHandler);
    }
}

let testproject = new InputData();
//let active_projects = new ProjectList('active');
//let completed_projects = new ProjectList('completed');
