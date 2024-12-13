import { openDB } from "idb";
let db;

window.addEventListener("DOMContentLoaded", async () => {
    createDB();
    const inputNome = document.getElementById("nome");
    const inputIdade = document.getElementById("idade");

    // Salvando dados
    document.getElementById("btnSalvar").addEventListener("click", () => addData(inputNome, inputIdade));

    // Listando dados
    document.getElementById("btnListar").addEventListener("click", getData);

    // Atualizando dados
    document.getElementById("btnAtt").addEventListener("click", () => updateData(inputNome, inputIdade));

    // Removendo dados
    document.getElementById("btnRemove").addEventListener("click", () => deleteData(inputNome));
});

async function createDB() {
    try {
        db = await openDB('bancodaJu', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('pessoas', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        showResult("Banco de dados criado!");
                }
            }
        });
        showResult("Banco de dados aberto.");
    } catch (e) {
        showResult("Erro ao criar o banco de dados: " + e.message);
    }
}

async function addData(inputNome, inputIdade) {
    const nome = inputNome.value;
    const idade = inputIdade.value;

    if (!nome || !idade) {
        showResult("Preencha com nome e idade");
        return;
    }

    try {
        const tx = await db.transaction('pessoas', 'readwrite');
        const store = tx.objectStore('pessoas');

        const id = Date.now();
        const pessoa = { nome, idade, id };

        await store.add(pessoa);
        await tx.done;
        showResult("Pessoa adicionada ao banco de dados.");
    } catch (e) {
        showResult("Erro ao adicionar os dados: " + e.message);
    }
}

async function getData() {
    if (db === undefined) {
        showResult("O banco de dados está fechado");
        return;
    }

    try {
        const tx = await db.transaction('pessoas', 'readonly');
        const store = tx.objectStore('pessoas');
        const value = await store.getAll();

        if (value.length > 0) {
            showResult("Dados do banco: " + JSON.stringify(value));
        } else {
            showResult("Não há nenhum dado no banco!");
        }
    } catch (e) {
        showResult("Erro ao obter os dados: " + e.message);
    }
}

function showResult(text) {
    document.querySelector("output").innerHTML = text;
}
