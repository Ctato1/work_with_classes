class ChangeDom {
    static clearEvents(element) {
        const cloned = element.cloneNode(true)
        element.replaceWith(cloned)
        return cloned
    }

    static moveElement(elementId, atElement) {
        const element = document.getElementById(elementId)
        const destination = document.querySelector(atElement)
        destination.append(element)
        return element
    }
}

class InfoSection {
    constructor(closeNotifierFn) {
        this.closeNotifier = closeNotifierFn
    }

    closeInfo = () => {
        this.delete();
        this.closeNotifier()
    }

    delete() {
        this.element.remove()
    }

    show() {
        const main = document.querySelector('main')
        const infoEl = document.createElement('div')
        infoEl.className = 'info'
        infoEl.textContent = 'HELLO'
        infoEl.addEventListener('click', this.closeInfo)
        this.element = infoEl
        main.append(infoEl)
    }
}

function addImage(){
    const activeSection = document.getElementById('active-projects')
        const finishedSection = document.getElementById('finished-projects')
        const activeUl = document.querySelector('#active-projects ul')
        const finishedUl = document.querySelector('#finished-projects ul')
        // console.log(ul1.innerHTML);
        activeSection.style.background = 'white'
        finishedSection.style.background = 'white'
        let activeStyle = activeSection.style
        let finishedStyle = finishedSection.style
        if(activeUl.innerHTML == 0){
            activeStyle.background = 'url("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg")'
            activeStyle.backgroundPosition = 'center';
            activeStyle.backgroundRepeat = 'no-repeat';
            activeStyle.backgroundSize = 'cover';
        }else if(finishedUl.innerHTML == 0){
            finishedStyle.background = 'url("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg")'
            finishedStyle.backgroundPosition = 'center';
            finishedStyle.backgroundRepeat = 'no-repeat';
            finishedStyle.backgroundSize = 'cover';
        }
}


class ProjectItem {
    // hasActive = !false
    constructor(id, updateProjectList, type) {
        this.id = id;
        this.updateProjectHendler = updateProjectList;
        this.switchButton(type);
        this.infoButton()
    }

    infoHendler() {
        if (this.hasActive) {
            return
        }
        const showInfo = new InfoSection(() => {
            this.hasActive = !true
        });
        showInfo.show();
        this.hasActive = true
    }

    infoButton() {
        const projectItem = document.getElementById(this.id)
        let infoBtn = projectItem.querySelector(`button:first-of-type`);
        infoBtn.addEventListener('click', this.infoHendler)
    }

    switchButton(type) {

        const projectItem = document.getElementById(this.id)
        let switchBtn = projectItem.querySelector(`button:last-of-type`);
        switchBtn = ChangeDom.clearEvents(switchBtn);
        switchBtn.textContent = type === 'active' ? "Finish" : 'Activate';
        switchBtn.addEventListener(
            'click',
            this.updateProjectHendler.bind(null, this.id)
        )
        addImage()
    }

    update(updateListFn, type) {
        this.updateProjectHendler = updateListFn;
        this.switchButton(type)
    }
}



class ProjectList {
    projects = []
    constructor(type) {
        this.type = type
        const projectList = document.querySelectorAll(`#${type}-projects li`);

        

        for (const project of projectList) {
            this.projects.push(new ProjectItem(project.id, this.switchProject.bind(this), this.type))
        }
        console.log(this.projects);
    }

    setSwitchHandler(switchHandlerFn) {
        this.switchHandler = switchHandlerFn
    }

    addProject(proj) {
        this.projects.push(proj)
        ChangeDom.moveElement(proj.id, `#${this.type}-projects ul`)
        proj.update(this.switchProject.bind(this), this.type)
    }

    switchProject(projId) {
        this.switchHandler(this.projects.find(i => i.id === projId))
        this.projects.filter(i => i.id !== projId);
    }
}



class App {
    static init() {
        const activeProjects = new ProjectList('active');
        const finishedProjects = new ProjectList('finished');

        activeProjects.setSwitchHandler(
            finishedProjects.addProject.bind(finishedProjects)
        )
        finishedProjects.setSwitchHandler(
            activeProjects.addProject.bind(activeProjects)
        )
        
    }
}

App.init()