//Declarando as variáveis para os elementos do HTML
const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");

const tasksContainer = document.querySelector(".tasks-container");

//Vailidação de tarefa (utilizando arrow function em vez de um if...else)
const validateInput = () => inputElement.value.trim().length > 0;

const handleAddTask = () => {
  const inputIsValid = validateInput();
    //Se o valor do input for false cria uma classe de erro que deixa o input vermelho
    if (!inputIsValid) {
      return inputElement.classList.add("error");
    }

    //cria a uma div dentro do tasks-container
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    //Cria um parágrafo dentro da div e recebe o conteúdo do input
    const taskContent = document.createElement("p");
    taskContent.innerText = inputElement.value;

    //adiciona o evento de clique no parágrafo
    taskContent.addEventListener('click', () => handleClick(taskContent));

    //Cria o ícone de lixeira para o botão delete
    const deleteItem = document.createElement("i");
    deleteItem.classList.add("fa-regular");
    deleteItem.classList.add("fa-trash-can");

    //adiciona o evento de clique no botão delete
    deleteItem.addEventListener('click', () => handleDeleteClick(taskItemContainer, taskContent));

    //Coloca o elemento e o ícone dentro da Div taskItemContainer
    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    //Coloca o task-item dentro da div tasks-container
    tasksContainer.appendChild(taskItemContainer);

    //String vazia para limpar o imput após digitar uma tarefa
    inputElement.value = "";

    updateLocalStorage();
};

//adicionando a funcionalidade do clique na tarefa 
const handleClick = (taskContent) => {
  //Declarando a variável tasks para os filhos de tasksContainer 
   const tasks = tasksContainer.childNodes;

  /*Cria um loop entre as tarefas e confere se o item atual é o mesmo que está sendo clicado pelo usuário
   caso seja verdadeiro, atualiza a classe da tarefa para completed*/
  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      task.firstChild.classList.toggle("completed")
    }
  }

  updateLocalStorage();
}

/*Repete a iteração entre os itens da lista, confere se o item é o mesmo que está sendo clicado pelo usuário
  caso seja verdadeiro, remove o item (taskContent) */
const handleDeleteClick = (taskItemContainer, taskContent) => {
    const tasks = tasksContainer.childNodes;

    for (const task of tasks) {
      const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent)

        if (currentTaskIsBeingClicked) {
          taskItemContainer.remove();
        }
    }
}


const handleInputChange = () => {
  const inputIsValid = validateInput();
  //Se o valor for true, remove a classe error
  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

//Função que atualiza o LocalStorage tanto com adição quanto com deleção de algum item
const updateLocalStorage = () => {
    const tasks = tasksContainer.childNodes

    const localStorageTasks = [...tasks].map(task => {
      const content = task.firstChild;
      const isCompleted = content.classList.contains("completed");

      return {description: content.innerText , isCompleted};

   });
    localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
}

//Função para pegar as tarefas no Local Storage 
const refreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    const taskContent = document.createElement("p");
    taskContent.innerText = task.description;

    if (task.isCompleted) {
        taskContent.classList.add("completed");
    }

    taskContent.addEventListener('click', () => handleClick(taskContent));

    const deleteItem = document.createElement("i");
    deleteItem.classList.add("fa-regular");
    deleteItem.classList.add("fa-trash-can");

    deleteItem.addEventListener('click', () => handleDeleteClick(taskItemContainer, taskContent));
  
    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    tasksContainer.appendChild(taskItemContainer);
  }
};

//Chamando a função para pegar os itens do local storage, para os itens não sumirem ao recarregar a página
refreshTasksUsingLocalStorage();

//Executa o validadeInput ao clicar no taskButton
addTaskButton.addEventListener("click", () => handleAddTask());

//Executa a função para remover o erro caso o valor do input seja true
inputElement.addEventListener("change", () => handleInputChange());