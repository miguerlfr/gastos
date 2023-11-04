document.addEventListener('DOMContentLoaded', function () {
    let presupuestoInicial;
    let saldoRestante;

    function actualizarColorBarraProgreso() {
        const porcentaje = (saldoRestante / presupuestoInicial) * 100;
        const barraProgreso = document.querySelector('.progress-bar');
        barraProgreso.style.backgroundColor = porcentaje > 50 ? 'rgb(182, 182, 32)' : (porcentaje > 20 ? 'orange' : 'red');
    }

    function mostrarMensaje(mensaje, esError = false) {
        const mensajeElemento = document.getElementById('mensaje');

        if (esError) {
            mensajeElemento.classList.add('error');
        } else {
            mensajeElemento.classList.remove('error');
        }

        mensajeElemento.textContent = mensaje;
        mensajeElemento.style.display = 'block';
        mensajeElemento.classList.add('animado');

        setTimeout(() => {
            mensajeElemento.style.display = 'none';
            mensajeElemento.classList.remove('animado');
        }, 3000);
    }

    const divInicial = document.getElementById('divInicial');
    const formulario = document.getElementById('formulario');
    const btnAceptar = document.getElementById('btnAceptar');

    btnAceptar.addEventListener('click', function () {
        presupuestoInicial = parseFloat(document.getElementById('presupuestoInicial').value);

        if (isNaN(presupuestoInicial) || presupuestoInicial <= 0) {
            mostrarMensaje('Ingrese un presupuesto válido mayor a cero', true);
            return;
        }

        divInicial.style.display = 'none';
        formulario.style.display = 'block';

        saldoRestante = presupuestoInicial;
        actualizarEtiquetas();
        actualizarColorBarraProgreso();

        window.agregarGasto = function () {
            const nombreArticulo = document.getElementById('nombreArticulo').value;
            const precioArticulo = parseFloat(document.getElementById('precioArticulo').value);

            if (!nombreArticulo || isNaN(precioArticulo) || precioArticulo <= 0) {
                mostrarMensaje('Ingrese un nombre y precio de artículo válidos', true);
                return;
            }

            if (precioArticulo > saldoRestante) {
                mostrarMensaje('No tiene suficiente presupuesto para este artículo', true);
                return;
            }

            const gasto = {
                nombre: nombreArticulo,
                precio: precioArticulo
            };

            saldoRestante -= precioArticulo;
            actualizarEtiquetas();
            
            document.getElementById('nombreArticulo').value = '';
            document.getElementById('precioArticulo').value = '';

            agregarGastoALista(gasto);
            actualizarColorBarraProgreso();
        };

        function agregarGastoALista(gasto) {
            const listaGastos = document.getElementById('listaGastos');

            const gastoItem = document.createElement('div');
            gastoItem.classList.add('gasto-item');

            const gastoInfo = document.createElement('div');
            gastoInfo.textContent = `${gasto.nombre} - ${formatoMoneda(gasto.precio)}`;

            const botonBorrar = document.createElement('button');
            botonBorrar.textContent = 'Eliminar';
            botonBorrar.addEventListener('click', function () {
                saldoRestante += gasto.precio;
                actualizarEtiquetas();
                listaGastos.removeChild(gastoItem);
                document.getElementById('agregarBtn').removeAttribute('disabled');
                actualizarColorBarraProgreso();
            });

            gastoItem.appendChild(gastoInfo);
            gastoItem.appendChild(botonBorrar);
            listaGastos.appendChild(gastoItem);

            if (saldoRestante === 0) {
                document.getElementById('agregarBtn').setAttribute('disabled', 'disabled');
            }
        }

        function actualizarEtiquetas() {
            document.getElementById('presupuestoInicialLabel').textContent = formatoMoneda(presupuestoInicial);
            document.getElementById('saldoRestanteLabel').textContent = formatoMoneda(saldoRestante);

            const porcentaje = (saldoRestante / presupuestoInicial) * 100;
            const saldoRestanteLabel = document.getElementById('saldoRestanteLabel');

            saldoRestanteLabel.style.color = porcentaje > 50 ? 'rgb(182, 182, 32)' : (porcentaje > 20 ? 'orange' : 'red');
        }

        function formatoMoneda(valor) {
            // Formato para pesos colombianos
            return  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', }).format(valor);
        }
        
    });
});
