
script_reparado = """
function guardarNotas() {
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

function cargarNotas() {
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
            if (cont) {
              const div = document.createElement("div");
              div.className = "recup";
              div.innerHTML = `🔁 Recuperatorio: <input type="number" class="nota" name="${data.name}" value="${data.value}" min="10" max="100" />`;
              cont.appendChild(div);
              input = div.querySelector("input");
            }
          }
          if (input) input.value = data.value;
        });
      }
    });
  }
  actualizarEventos();
}

function crearTP(name = "") {
  const div = document.createElement("div");
  div.className = "tp";
  const id = name || `tp-${Date.now()}`;
  div.innerHTML = `💼 TP: <input type="number" class="nota" name="${id}" min="10" max="100" />
    <button class="eliminar-tp">🗑️</button>`;
  return div;
}

function actualizarEventos() {
  document.querySelectorAll("input.nota").forEach(input => {
    input.removeEventListener("input", input._eventoPersonalizado || (() => {}));
    input._eventoPersonalizado = () => {
      actualizarColor(input);
      mostrarRecuperatorio(input);
      calcularPromedios();
      guardarNotas();
    };
    input.addEventListener("input", input._eventoPersonalizado);
    actualizarColor(input);
    mostrarRecuperatorio(input);
  });

  document.querySelectorAll(".agregar-tp").forEach(btn => {
    btn.onclick = () => {
      const tpsDiv = btn.parentElement.querySelector(".tps");
      const nuevoTP = crearTP();
      tpsDiv.appendChild(nuevoTP);
      actualizarEventos();
      guardarNotas();
    };
  });

  document.querySelectorAll(".eliminar-tp").forEach(btn => {
    btn.onclick = () => {
      btn.parentElement.remove();
      calcularPromedios();
      guardarNotas();
    };
  });

  calcularPromedios();
}

function actualizarColor(input) {
  const val = parseInt(input.value);
  input.classList.remove("aprobado", "desaprobado");
  if (!isNaN(val)) {
    if (val >= 60) input.classList.add("aprobado");
    else input.classList.add("desaprobado");
  }
}

function mostrarRecuperatorio(input) {
  const cont = input.closest(".parcial, .final");
  if (!cont) return;
  const val = parseInt(input.value);
  const nombre = input.name;
  const existe = cont.querySelector(`input[name='${nombre}-recup']`);
  if (val < 60 && !existe) {
    const div = document.createElement("div");
    div.className = "recup";
    div.innerHTML = `🔁 Recuperatorio: <input type="number" class="nota" name="${nombre}-recup" min="10" max="100" />`;
    cont.appendChild(div);
    actualizarEventos();
  } else if (val >= 60 && existe) {
    existe.parentElement.remove();
  }
}

function calcularPromedios() {
  document.querySelectorAll(".materia").forEach(materia => {
    let total = 0, cantidad = 0;
    ["parcial1", "parcial2"].forEach(p => {
      const val = parseInt(materia.querySelector(`input[name='${p}']`)?.value);
      if (!isNaN(val)) { total += val; cantidad++; }
    });
    materia.querySelectorAll(".tp input").forEach(tp => {
      const val = parseInt(tp.value);
      if (!isNaN(val)) { total += val; cantidad++; }
    });
    const promedio = cantidad > 0 ? Math.round(total / cantidad) : 0;
    materia.querySelector(".promedio span").textContent = promedio;
  });
}

window.onload = () => {
  cargarNotas();
};
"""

# Guardar el archivo reparado
with open("/mnt/data/script.js", "w") as f:
    f.write(script_reparado)

"/mnt/data/script.js"
      
