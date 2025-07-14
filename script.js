script_js_corregido = """
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
    "Comprension y produccion lectora"
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
    "Practica profesionalizante ii"
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
    "Vacunacion e inmunizacion"
  ]
};

function guardarEnLocalStorage() {
  const datos = {};
  document.querySelectorAll(".materia").forEach(materia => {
    const nombre = materia.querySelector(".titulo-materia").textContent;
    const inputs = materia.querySelectorAll("input.nota");
    datos[nombre] = [];
    inputs.forEach(input => {
      datos[nombre].push({ name: input.name, value: input.value });
    });
  });
  localStorage.setItem("notasFacultad", JSON.stringify(datos));
}

function crearTP(name = "") {
  const div = document.createElement("div");
  div.className = "tp";
  const tpId = name || `tp-${Date.now()}`;
  div.innerHTML = `💼 TP: <input type="number" class="nota" name="${tpId}" min="10" max="100" />
    <button class="eliminar-tp">🗑️</button>`;
  return div;
}

function crearMateriaHTML(materia) {
  const divMateria = document.createElement("div");
  divMateria.className = "materia";
  divMateria.innerHTML = `
    <div class="titulo-materia">${materia}</div>
    <div class="parcial parcial1">
      📄 Parcial 1: <input type="number" class="nota" name="parcial1" min="10" max="100" />
    </div>
    <div class="parcial parcial2">
      📄 Parcial 2: <input type="number" class="nota" name="parcial2" min="10" max="100" />
    </div>
    <div class="final">
      🎓 Final: <input type="number" class="nota" name="final" min="10" max="100" />
    </div>
    <div class="tps">
      <div class="tp">
        💼 TP: <input type="number" class="nota" name="tp-1" min="10" max="100" />
        <button class="eliminar-tp">🗑️</button>
      </div>
    </div>
    <button class="agregar-tp">➕ Agregar TP</button>
    <div class="promedio">📊 Promedio (TPs + Parciales): <span>0</span></div>
  `;
  return divMateria;
}

function generarHTML() {
  const contenedor = document.getElementById("contenedor-anios");
  contenedor.innerHTML = "";
  for (let anio in materiasPorAnio) {
    const divAnio = document.createElement("div");
    divAnio.className = "anio";
    divAnio.innerHTML = `<h2>${anio}</h2>`;
    materiasPorAnio[anio].forEach(materia => {
      const divMateria = crearMateriaHTML(materia);
      divAnio.appendChild(divMateria);
    });
    contenedor.appendChild(divAnio);
  }
}

function cargarDesdeLocalStorage() {
  const datos = JSON.parse(localStorage.getItem("notasFacultad"));
  if (datos) {
    document.querySelectorAll(".materia").forEach(materia => {
      const nombre = materia.querySelector(".titulo-materia").textContent;
      if (datos[nombre]) {
        datos[nombre].forEach(data => {
          let input = materia.querySelector(`input[name='${data.name}']`);
          if (!input && data.name.startsWith("tp")) {
            const tps = materia.querySelector(".tps");
            const nuevo = crearTP(data.name);
            tps.appendChild(nuevo);
            input = nuevo.querySelector("input");
          }
          if (!input && data.name.includes("recup")) {
            const cont = materia.querySelector(`.${data.name.split("-")[0]}`);
            const recup = document.createElement("div");
            recup.className = "recup";
            recup.innerHTML = `🔁 Recuperatorio: <input type="number" class="nota" name="${data.name}" value="${data.value}" min="10" max="100">`;
            cont.appendChild(recup);
            input = recup.querySelector("input");
          }
          if (input) input.value = data.value;
        });
      }
    });
  }
}

function actualizarEventos() {
  document.querySelectorAll("input.nota").forEach(input => {
    input.addEventListener("input", () => {
      actualizarColores();
      agregarRecuperatorioSiDesaprueba(input);
      actualizarPromedios();
      guardarEnLocalStorage();
    });
    actualizarColorNota(input);
    agregarRecuperatorioSiDesaprueba(input);
  });

  document.querySelectorAll(".agregar-tp").forEach(btn => {
    btn.onclick = () => {
      const tpsDiv = btn.parentElement.querySelector(".tps");
      const nuevoTP = crearTP();
      tpsDiv.appendChild(nuevoTP);
      actualizarEventos();
      guardarEnLocalStorage();
    };
  });

  document.querySelectorAll(".eliminar-tp").forEach(btn => {
    btn.onclick = () => {
      btn.parentElement.remove();
      actualizarPromedios();
      guardarEnLocalStorage();
    };
  });

  actualizarPromedios();
}

function actualizarColorNota(input) {
  const nota = parseInt(input.value);
  input.classList.remove("aprobado", "desaprobado");
  if (!isNaN(nota)) {
    if (nota >= 60) input.classList.add("aprobado");
    else input.classList.add("desaprobado");
  }
}

function agregarRecuperatorioSiDesaprueba(input) {
  const cont = input.closest(".parcial, .final");
  if (!cont) return;
  const valor = parseInt(input.value);
  const nombre = input.name;
  let yaExiste = cont.querySelector(`.recup input[name='${nombre}-recup']`);

  if (valor < 60 && !yaExiste) {
    const div = document.createElement("div");
    div.className = "recup";
    div.innerHTML = `🔁 Recuperatorio: <input type="number" class="nota" name="${nombre}-recup" min="10" max="100" />`;
    cont.appendChild(div);
    div.querySelector("input").addEventListener("input", () => {
      actualizarColores();
      guardarEnLocalStorage();
    });
  } else if (valor >= 60 && yaExiste) {
    yaExiste.parentElement.remove();
  }
}

function actualizarPromedios() {
  document.querySelectorAll(".materia").forEach(materia => {
    let total = 0, cantidad = 0;
    ["parcial1", "parcial2"].forEach(name => {
      const input = materia.querySelector(`input[name='${name}']`);
      const val = parseInt(input?.value);
      if (!isNaN(val)) { total += val; cantidad++; }
    });
    materia.querySelectorAll(".tp input").forEach(tp => {
      const val = parseInt(tp.value);
      if (!isNaN(val)) { total += val; cantidad++; }
    });
    const promedio = cantidad ? Math.round(total / cantidad) : 0;
    materia.querySelector(".promedio span").textContent = promedio;
  });
}

window.onload = () => {
  generarHTML();
  cargarDesdeLocalStorage();
  actualizarEventos();
};
"""

# Guardar archivo final para descargar
with open("/mnt/data/script.js", "w") as f:
    f.write(script_js_corregido)

"/mnt/data/script.js"
      
