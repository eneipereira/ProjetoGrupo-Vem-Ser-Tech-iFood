const chalk = require("chalk");
const { execSync } = require("child_process");
const { log } = require("console");
const readline = require('readline');
const { mockDbTasks: tasks }  = require("./database/mockDbTasks")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const green = chalk.bold.green;
const red = chalk.bold.red;
const orange = chalk.bold.hex('#FFA500');
const black = chalk.bold.black;

function getNextTaskId() {
  let maxId = 0;
  for (const task of tasks) {
    if (task.id > maxId) {
      maxId = task.id;
    }
  }
  return maxId + 1;
}

function showMenu() {

  const menu = chalk`
{black {bold Selecione uma opção:}}
{green 1. Adicionar tarefa
2. Listar tarefas
3. Editar tarefa
4. Remover tarefa
5. Buscar tarefa por ID ou termo
0. Sair}
  `;

  log(menu);

  rl.question(chalk`{cyan Opção:} `, (option) => {
    switch (option) {
      case '1':
        rl.question(black('\nDigite a tarefa: '), (task) => {
          tasks.push({ id: getNextTaskId(), task });
          console.log(green('\nTarefa adicionada com sucesso!'));
          showMenu();
        });
        break;
      case '2':
        if (tasks.length > 0) {
          console.log(black('\nTarefas: '));
          tasks.forEach((t) => {
            console.log(chalk`{magenta {bold ${t.id}. ${t.task}}}`);
          });
        } else {
          console.log(red('\nNenhuma tarefa cadastrada.'));
        }
        showMenu();
        break;
      case '3':
        rl.question(black('\nDigite o ID da tarefa que deseja editar: '), (id) => {
          const taskToEdit = tasks.find((t) => t.id == id);
          if (taskToEdit) {
            rl.question(black('\nDigite a nova descrição: '), (newTask) => {
              taskToEdit.task = newTask;
              console.log(green('\nTarefa editada com sucesso!'));
              showMenu();
            });
          } else {
            console.log(red('\nTarefa não encontrada.'));
            showMenu();
          }
        });
        break;
      case '4':
        rl.question(black('\nDigite o ID da tarefa que deseja remover: '), (id) => {
          const taskIndex = tasks.findIndex((t) => t.id == id);
          if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            console.log(green('\nTarefa removida com sucesso!'));
          } else {
            console.log(red('\nTarefa não encontrada.'));
          }
          showMenu();
        });
        break;
      case '5':
        rl.question(black('\nDigite um termo ou ID da tarefa: '), (term) => {
          const matchingTasks = tasks.filter((t) => {
            return t.id == term || t.task.toLowerCase().includes(term.toLowerCase());
          });
          if (matchingTasks.length > 0) {
            console.log(green('\nTarefas encontradas:'));
            matchingTasks.forEach((t) => {
              console.log(`${t.id}. ${t.task}`);
            });
          } else {
            console.log(red('\nNenhuma tarefa correspondente encontrada.'));
          }
          showMenu();
        });
        break;
      case '0':
        console.log(orange('\nAté mais!\n'));
        rl.close();
        break;
      default:
        console.log(red('\nOpção inválida. Tente novamente.'));
        showMenu();
    }
  });
}

log(chalk`{bgBlue {white Olá, esta é a sua lista de tarefas!}}`);
execSync("sleep 2");
showMenu();
