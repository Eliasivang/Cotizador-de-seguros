//variables

const btnCotizar= document.querySelector("#button-cot");

const formulario = document.querySelector("#cotizar-seguro")

//CONSTRUCTORES

function Seguro(marca,year,tipo){
    this.marca =marca;
    this.year= year;
    this.tipo = tipo;
}

function UI(){}
// realiza la cotizacion con los datos

Seguro.prototype.cotizarSeguro = function(){
    /* 
    1= americano 1.15
    2= asiatico 1.05
    3= europeo 1.35
    */
   let cantidad;
   const base = 2000;

 switch(this.marca){
    case "1":
        cantidad = base * 1.15;
        break;
    case "2":
        cantidad = base * 1.05;
        break;
    case "3":
        cantidad=  base * 1.35;
        break;
    default:
        break;
 }


 //LEER EL ANO 
 const diferencia = new Date().getFullYear() - this.year;
 //CADA ANO QUE LA DIFERENCIA ES MAYOR EL COSTO VA A REDUCIRSE EL VALOR UN 3 PORCIENTO DEL SEGURO
 cantidad -=((diferencia*3) * cantidad) / 100;
 
        /*

        SI EL SEGURO ES BASICO SE MULTIPLICA POR UN 30%MAS
        SI EL SEGURO ES COMPLETO SE MULTIPLICA POR UN 50%MAS

        */
    if(this.tipo === "basico"){
        cantidad *= 1.3;
    }else {
        cantidad *= 1.5;
    }
    return cantidad;

}



UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20; 
          const selectYear = document.querySelector("#year");
          for(let i = max; i > min; i--) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectYear.appendChild(option);
          }
}

UI.prototype.mostrarMensaje = (mensaje, tipo)=>{
    const div = document.createElement("div");
    if (tipo === "error") {
        div.classList.add("error");
    }else {
        div.classList.add("correcto");
    }
    div.classList.add("mensaje");
    div.textContent= mensaje;
    const error = document.querySelectorAll(".mensaje");
    if(error.length===0){
        formulario.insertBefore(div, document.querySelector(".button-container")); // para que no se duplique el mensaje.
    }
    setTimeout(() => {
        div.remove();
    },3000);
}

UI.prototype.mostrarResultado = (total,seguro)=>{
    const {marca, year, tipo} = seguro;
    let textoMarca;
    switch(marca){
        case "1":
            textoMarca = "Americano";
            break;
        case "2":
            textoMarca = "Asiatico";
            break;
        case "3":
            textoMarca = "Europeo";
            break;
        default:
            break;
    }
    //crear el resultado
    const div = document.createElement("div");
    div.classList.add("tu-resumen");

    div.innerHTML = `
        <p class= "header">Tu Resumen</p>
        <p class= "total">Marca: <span class="total-sp"> ${textoMarca}</span></p>
        <p class= "total">Año: <span class="total-sp"> ${year}</span></p>
        <p class= "total">Tipo: <span class="total-sp"> ${tipo}</span></p>
        <p class= "total">Total: <span class="total-sp"> $${total}</span></p>
    `
;
    const resultadoDiv = document.querySelector("#resultado");
    

    //mostrar el spinner

    const spinner = document.querySelector(".spinner");
   spinner.style.display = "block"
   setTimeout(()=>{
        spinner.style.display= "none";
        resultadoDiv.appendChild(div);
   },3000)

   

}
// instanciar ui
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); //llena el select con los anos

})

eventListeners();
function eventListeners(){
    formulario.addEventListener("submit", validarFormulario);

}

function validarFormulario(e){
    e.preventDefault();
    const marca = document.querySelector(".select-1").value;
    const year = document.querySelector("#year").value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    if(marca === "" || year=== "" || tipo === "" ){
        ui.mostrarMensaje("Todos los campos son obligatorios.", "error"); 
        return; 
    }
    ui.mostrarMensaje("Cotizando, por favor espere.", "correcto"); 
    //OCULATMOS LAS COTIZACIONES PREVIAS

    const resultados = document.querySelector("#resultado div");
    if(resultados != null){
        resultados.remove();
    }
    
    // INSTANCIAR EL SEGURO
    const seguro = new Seguro(marca,year,tipo); //creamos la nueva instancia del seguro donde le pasamos los parametros de los selectores.
    const total = seguro.cotizarSeguro();

    
    // UTILIZAR EL PROTOTYPE QUE VA A COTIZAR
    ui.mostrarResultado(total, seguro);
}


//instanciar el seguro

