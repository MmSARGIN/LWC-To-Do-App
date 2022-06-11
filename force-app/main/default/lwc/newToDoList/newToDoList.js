import { LightningElement, track, wire } from "lwc";
import getTasksForMe from "@salesforce/apex/getAllTasks.getTasksForMe";
import addToDoToDataBase from "@salesforce/apex/getAllTasks.addToDoToDataBase";
import deleteToDo from "@salesforce/apex/getAllTasks.deleteToDo";
import {refreshApex} from '@salesforce/apex';

export default class NewToDoList extends LightningElement {
  inpVal = "";
  result;
  @track
  tasksList = [
    //     {
    //      name : 'Melih',
    //      id : 12,
    //      recordId: 4
    // }
  ];
  toDoresponse;


  handleChange(event) {
    this.inpVal = event.target.value;
    // console.log(this.inpVal);
  }
  
  

  // İNSERT TODO TASKLİST AND DATABASE;
  handleClick() {
    console.log(this.inpVal);
    if (this.inpVal !== "") {
      addToDoToDataBase({
        subject: this.inpVal
      })
        .then((result) => {

          console.log(result);
          this.tasksList.push({
            id: this.tasksList.length + 1,
            name: this.inpVal.toUpperCase(),
            recordId: result.Id,
            
          });
          console.log("ula2", this.tasksList);
          this.inpVal = "";
        })
        .catch((error) => console.log(error));
    }
  }

 
// delete task database and array
  deleteTask(event) {
    let idForDel = event.target.name;
    let tasksList = this.tasksList;
    let toDoIndex;
    let recordIdToDo;
    
    for (let i = 0; i < tasksList.length; i++) {
      if (idForDel === tasksList[i].id) {
        toDoIndex = i;
      }
    }

    recordIdToDo = tasksList[toDoIndex].recordId;
    console.log(recordIdToDo);
    deleteToDo({
      recordId: recordIdToDo
    })
      .then((result) => {
        console.log(result);
        if (result) {
          console.log("ındex" + toDoIndex);
          this.tasksList.splice(toDoIndex, 1);
console.log(tasksList);
        } else {
          console.log("Delete is not success");
        }
      })
      .catch((error) => console.log(error));
      
  }
//GET TASKS FROM DATABASE AND PUSH TASKLİST
  @wire(getTasksForMe)
  takeTasks(response) {
    this.toDoresponse = response;
    let data = response.data;
    console.log(data);
    if (data) {
      console.log("data var");
      this.tasksList = [];
      data.forEach((task) => {
        this.tasksList.push({
          id: this.tasksList.length + 1,
          name: task.Subject.toUpperCase(),
          recordId: task.Id
        });
        console.log("ula", this.tasksList);
      });
    } else {
      console.log("error");
    }
  }
// check event
  checkToDo(event) {
    let i = event.target.name - 1;
    if (
      this.template
        .querySelectorAll(".changeClass")[i].classList.contains("dynamicCSS")
    ) {
      this.template
        .querySelectorAll(".changeClass")[i].classList.remove("dynamicCSS");
    } else {
      this.template
        .querySelectorAll(".changeClass")[i].classList.add("dynamicCSS");
    }

    // this.template.querySelector(".changeClass").classList.remove("changeClass");
  }
  handleRefresh(){
    refreshApex(this.toDoresponse);
      }
}
