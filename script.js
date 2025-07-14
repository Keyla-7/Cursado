const materiasPorAnio = {
  "Primer año": [
    "Antropologia",
    "Procesos psicologicos y sociales",
    "Entornos virtuales",
    "Comunicación en salud",
    "Bases del cuidado",
    "Morfofisiología",
    "Fisico-quimica",
    "Enfermeria comunitaria y salud publica",
    "Practica profesionalizante i",
    "Matematicas",
    "Comprension y produccion lectora",
  ],
  "Segundo año": [
    "Educacion para la salud",
    "Nutricion y dietoterapia",
    "Microbiologia parasitologia e inmunologia",
    "Epidemiologia y bioestadistica",
    "Farmacologia aplicada a la enfermeria",
    "Fisiopatologia humana",
    "Cuidados de enfermeria en el adulto",
    "Aspectos psicosociales y culturales del desarrollo",
    "Cuidados de enfermeria en el adulto mayor",
    "Practica profesionalizante ii",
  ],
  "Tercer año": [
    "Ingles tecnico",
    "Investigacion en salud",
    "Cuidados de enfermeria en salud mental",
    "Cuidados de enfermeria en emergencias y catastrofes",
    "Etica y legislacion aplicada a la enfermeria",
    "Gestion del cuidado en enfermeria",
    "Cuidados de enfermeria materna y del recien nacido",
    "Cuidados de enfermeria en las infancias y adolescencias",
    "Practica profesionalizante iii",
    "Vacunacion e inmunizacion",
  ],
};

function guardarEnLocalStorage() {
  localStorage.setItem("notasFacultad", document.getElementById("contenedor-anios").innerHTML);
}

function cargarDesdeLocalStorage() {
  const guardado = localStorage.getItem("notasFacultad");
  if (guardado) {
    document.getElementById("contenedor-anios").innerHTML = guardado;
    actualizarEventos();
  } else {
    generarHTML();
  }
}

function generarHTML() {
  const contenedor = document.getElementById("contenedor-anios");
  contenedor.innerHTML = "";
  for (let anio in materiasPorAnio) {
    const divAnio = document.createElement("div");
    divAnio.className = "anio";
    divAnio.innerHTML = `<h2>${anio}</h2>`;

    materiasPorAnio[anio].forEach(materia => {
      const divMateria = document.createElement("div");
      divMateria.className = "materia";
      divMateria.innerHTML = `
        <div class="titulo-materia">${materia}</div>
        <div class="parcial">
          📄 Parcial 1: <input type="number" class="nota" min="10" max="100" />
        </div>
          📄 Parcial 2: <input type="number" class="nota" min="10" max="100" />
        </div>
          🎓 Final 1: <input type="number" class="nota" min="10" max="100" />
        </div>
        <div class="tp">
          <div class="tp">
            💼 TP: <input type="number" class="nota" min="10" max="100" />
            <button class="eliminar-tp">🗑️</button>
          </div>
        </div>
        <button class="agregar-tp">➕ Agregar TP</button>
        <div class="promedio">📊 Promedio: <span>0</span></div>
      `;
      divAnio.appendChild(divMateria);
    });

    contenedor.appendChild(divAnio);
  }
  actualizarEventos();
}

function actualizarEventos() {
  document.querySelectorAll(".nota").forEach(input => {
    input.addEventListener("input", () => {
      actualizarColores();
      actualizarPromedios();
      guardarEnLocalStorage();
    });
    actualizarColorNota(input);
  });

  document.querySelectorAll(".agregar-tp").forEach(btn => {
    btn.addEventListener("click", e => {
      const tpsDiv = e.target.parentElement.querySelector(".tps");
      const nuevoTP = document.createElement("div");
      nuevoTP.className = "tp";
      nuevoTP.innerHTML = `💼 TP: <input type="number" class="nota" min="10" max="100" />
        <button class="eliminar-tp">🗑️</button>`;
      tpsDiv.appendChild(nuevoTP);
      actualizarEventos();
      guardarEnLocalStorage();
    });
  });

  document.querySelectorAll(".eliminar-tp").forEach(btn => {
    btn.addEventListener("click", e => {
      e.target.parentElement.remove();
      actualizarPromedios();
      guardarEnLocalStorage();
    });
  });
  actualizarPromedios();
}

function actualizarColores() {
  document.querySelectorAll("input.nota").forEach(input => {
    actualizarColorNota(input);
  });
}

function actualizarColorNota(input) {
  const nota = parseInt(input.value);
  input.classList.remove("aprobado", "desaprobado");
  if (!isNaN(nota)) {
    if (nota >= 60) {
      input.classList.add("aprobado");
    } else {
      input.classList.add("desaprobado");
    }
  }
}

function actualizarPromedios() {
  document.querySelectorAll(".materia").forEach(materia => {
    const inputs = materia.querySelectorAll("input.nota");
    let total = 0;
    let cantidad = 0;
    inputs.forEach(input => {
      const val = parseInt(input.value);
      if (!isNaN(val)) {
        total += val;
        cantidad++;
      }
    });
    const promedio = cantidad > 0 ? Math.round(total / cantidad) : 0;
    materia.querySelector(".promedio span").textContent = promedio;
  });
}

cargarDesdeLocalStorage();
