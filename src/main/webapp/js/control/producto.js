/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var control_producto_list = function(path) {
    //contexto privado

    var prefijo_div = "producto_list";

    function cargaBotoneraMantenimiento() {
        var botonera = [
            {"class": "btn btn-mini action01", "icon": "icon-eye-open", "text": ""},
            {"class": "btn btn-mini action02", "icon": "icon-zoom-in", "text": ""},
            {"class": "btn btn-mini action03", "icon": "icon-pencil", "text": ""},
            {"class": "btn btn-mini action04", "icon": "icon-remove", "text": ""}
        ];
        return botonera;
    }

    function cargaBotoneraBuscando() {
        var botonera = [
            {"class": "btn btn-mini action01", "icon": "icon-ok", "text": ""}
        ];
        return botonera;
    }

    function loadDivView(view, place, id) {
        $(place).empty().append((view.getObjectTable(id))
                + '<button class="btn btn-primary" id="limpiar">Limpiar</button>');
        $('#limpiar').click(function() {
            $(place).empty();
        });
    }

    function loadModalForm(view, place, id, action) {
        cabecera = '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
        if (action == "edit") {
            cabecera += '<h3 id="myModalLabel">Edición de ' + view.getObject().getName() + "</h3>";
        } else {
            cabecera += '<h3 id="myModalLabel">Alta de ' + view.getObject().getName() + "</h3>";
        }
        pie = '<button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Cerrar</button>';

        loadForm(place, cabecera, view.getEmptyForm(), pie, false);
        if (action == "edit") {
            view.doFillForm(id);
        } else {
            $('#id').val('0').attr("disabled", true);
            $('#nombre').focus();
        }


        //en desarrollo: tratamiento de las claves ajenas ...
        $('#id_tipoproducto_button').unbind('click');
        $('#id_tipoproducto_button').click(function(event) {

            var tipoproducto = objeto('tipoproducto', path);
            var tipoproductoView = vista(tipoproducto, path);

            cabecera = '<button id="full-width" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>" + "<h3 id="myModalLabel">Elección</h3>';
            pie = '<button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Cerrar</button>';
            listado = tipoproductoView.getEmptyList();
            loadForm('#modal02', cabecera, listado, pie, true);

            $('#modal02').css({
                'right': '20px',
                'left': '20px',
                'width': 'auto',
                'margin': '0',
                'display': 'block'
            });

 

            var tipoproductoControl = control_tipoproducto_list();
            tipoproductoControl.inicia(tipoproductoView, 1, null, null, 10, null, null, null, callbackSearchTipoproducto);


            function callbackSearchTipoproducto(id) {
                
                $('#modal02').modal('hide');
                $('#modal02').data('modal', null);
                $('#id_tipoproducto').val($(this).attr('id'));
                $('#id_tipoproducto_desc').empty().html(tipoproducto.getOne($(this).attr('id')).descripcion);
                return false;
            }
            
            return false;
        

        });




        $('#submitForm').unbind('click');
        $('#submitForm').click(function(event) {
            //validaciones...
            enviarDatosUpdateForm(view, id);
            return false;
      
        });
    }

    function removeConfirmationModalForm(view, place, id) {
        cabecera = "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>" +
                "<h3 id=\"myModalLabel\">Borrado de " + view.getObject().getName() + "</h3>";
        pie = "<div id=\"result\">¿Seguro que desea borrar el registro?</div>" +
                '<button id="btnBorrarSi" class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Sí</button>' +
                '<button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">No</button>';
        loadForm(place, cabecera, view.getObjectTable(id), pie, false);
        $('#btnBorrarSi').unbind('click');
        $('#btnBorrarSi').click(function() {
            resultado = view.getObject().removeOne(id);
            cabecera = "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>" + "<h3 id=\"myModalLabel\">Respuesta del servidor</h3>";
            pie = "<button class=\"btn btn-primary\" data-dismiss=\"modal\" aria-hidden=\"true\">Cerrar</button>";
            loadForm('#modal02', cabecera, "Código: " + resultado["status"] + "<br />" + resultado["message"] + "<br />", pie, true);
        });
    }

    function loadModalView(view, place, id) {
        cabecera = "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>" +
                "<h3 id=\"myModalLabel\">Detalle de " + view.getObject().getName() + "</h3>";
        pie = "<button class=\"btn btn-primary\" data-dismiss=\"modal\" aria-hidden=\"true\">Cerrar</button>";
        loadForm(place, cabecera, view.getObjectTable(id), pie, true);
    }

    function enviarDatosUpdateForm(view, id) {
        $.fn.serializeObject = function()
        {
            // http://jsfiddle.net/davidhong/gP9bh/
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = encodeURIComponent(this.value) || '';
                }
            });
            return o;
        };
        var jsonObj = [];
        jsonObj = $('#formulario').serializeObject();
        jsonfile = {json: JSON.stringify(jsonObj)};
        cabecera = "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>" + "<h3 id=\"myModalLabel\">Respuesta del servidor</h3>";
        pie = "<button class=\"btn btn-primary\" data-dismiss=\"modal\" aria-hidden=\"true\">Cerrar</button>";
        resultado = view.getObject().saveOne(jsonfile);
        if (resultado["status"] = "200") {
            mensaje = 'valores actualizados correctamente para el registro con id=' + resultado["message"];
            loadForm('#modal02', cabecera, "Código: " + resultado["status"] + "<br />" + mensaje + "<br />" + view.getObjectTable(resultado["message"]), pie, true);
        } else {
            mensaje = 'el servidor ha retornado el mensaje de error=' + resultado["message"];
            loadForm('#modal02', cabecera, "Código: " + resultado["status"] + "<br />" + mensaje + "<br />" + view.getObjectTable(resultado["message"]), pie, true);
        }
    }
    return {
        inicia: function(view, pag, order, ordervalue, rpp, filter, filteroperator, filtervalue, callback) {

            var thisObject = this;

            //controlar que no estemos en una página fuera de órbita

            if (parseInt(pag) > parseInt(view.getObject().getPages(rpp, filter, filteroperator, filtervalue))) {
                pag = view.getObject().getPages(rpp, filter, filteroperator, filtervalue);
            }

            //muestra la botonera de páginas

            $("#pagination").empty().append(view.getLoading()).html(view.getPageLinks(pag, rpp, filter, filteroperator, filtervalue));

            //muestra el listado principal

            if (callback) {
                $("#datos").empty().append(view.getLoading()).html(view.getPageTable(pag, order, ordervalue, rpp, filter, filteroperator, filtervalue, cargaBotoneraBuscando()));
            } else {
                $("#datos").empty().append(view.getLoading()).html(view.getPageTable(pag, order, ordervalue, rpp, filter, filteroperator, filtervalue, cargaBotoneraMantenimiento()));
            }

            //muestra la frase con el número de registros de la consulta

            $("#registers").empty().append(view.getLoading()).html(view.getRegistersInfo(filter, filteroperator, filtervalue));

            //muestra la frase de estado de la ordenación de la tabla

            $("#order").empty().append(view.getLoading()).html(view.getOrderInfo(order, ordervalue));

            //muestra la frase de estado del filtro de la tabla aplicado

            $("#filter").empty().append(view.getLoading()).html(view.getFilterInfo(filter, filteroperator, filtervalue));

            //asignación eventos de la botonera de cada línea del listado principal
            if (callback) {
                $('.btn.btn-mini.action01').unbind('click');
                $('.btn.btn-mini.action01').click(callback);
            } else {
                $('.btn.btn-mini.action01').unbind('click');
                $('.btn.btn-mini.action01').click(function() {
                    loadDivView(view, '#datos2', $(this).attr('id'));
                });

                $('.btn.btn-mini.action02').unbind('click');
                $('.btn.btn-mini.action02').click(function() {
                    loadModalView(view, '#modal01', $(this).attr('id'));
                });

                $('.btn.btn-mini.action03').unbind('click');
                $('.btn.btn-mini.action03').click(function() {
                    loadModalForm(view, '#modal01', $(this).attr('id'), "edit");
                });

                $('.btn.btn-mini.action04').unbind('click');
                $('.btn.btn-mini.action04').click(function() {
                    removeConfirmationModalForm(view, '#modal01', $(this).attr('id'));
                });
            }

            //asignación de evento del enlace para quitar el orden en el listado principal

            $('#linkQuitarOrden').unbind('click');
            $('#linkQuitarOrden').click(function() {
                thisObject.inicia(view, pag, null, null, rpp, filter, filteroperator, filtervalue, callback);
            });

            //asignación de evento del enlace para quitar el filtro en el listado principal

            $('#linkQuitarFiltro').unbind('click');
            $('#linkQuitarFiltro').click(function() {
                thisObject.inicia(view, pag, order, ordervalue, rpp, null, null, null, callback);
            });

            //asignación de eventos de la ordenación por columnas del listado principal

            $.each(view.getObject().getFieldNames(), function(index, valor) {
                $('.orderAsc').unbind('click');
                $('.orderAsc' + index).click(function() {
                    rpp = $("#rpp option:selected").text();
                    thisObject.inicia(view, pag, valor, "asc", rpp, filter, filteroperator, filtervalue, callback);
                });
                $('.orderDesc').unbind('click');
                $('.orderDesc' + index).click(function() {
                    rpp = $("#rpp option:selected").text();
                    thisObject.inicia(view, pag, valor, "desc", rpp, filter, filteroperator, filtervalue, callback);
                });

            });

            //asignación del evento de click para cambiar de página en la botonera de paginación

            $('.pagination_link').unbind('click');
            $('.pagination_link').click(function(event) {
                var id = $(this).attr('id');
                rpp = $("#rpp option:selected").text();
                thisObject.inicia(view, id, order, ordervalue, rpp, filter, filteroperator, filtervalue, callback);
                return false;
                
            });

            //boton de crear un nuevo elemento
            $('#crear').unbind('click');
            $('#crear').click(function() {
                loadModalForm(view, '#modal01', $(this).attr('id'));
            });

            //asignación del evento de filtrado al boton

            $('#btnFiltrar').unbind('click');
            $("#btnFiltrar").click(function(event) {
                filter = $("#selectFilter option:selected").text();
                filteroperator = $("#selectFilteroperator option:selected").text();
                filtervalue = $("#inputFiltervalue").val();
                thisObject.inicia(view, pag, order, ordervalue, rpp, filter, filteroperator, filtervalue, callback);
                
                return false;
            });

            //asigación de evento de refresco de la tabla cuando volvemos de una operación en ventana modal

            $('#modal01').unbind('hidden');
            $('#modal01').on('hidden', function() {

                rpp = $("#rpp option:selected").text();
                thisObject.inicia(view, pag, order, ordervalue, rpp, filter, filteroperator, filtervalue, callback);
                
            });

            //asignación del evento de cambio del numero de regs por página

            $('#rpp').unbind('change');
            $('#rpp').on('change', function() {
                rpp = $("#rpp option:selected").text();
                thisObject.inicia(view, pag, order, ordervalue, rpp, filter, filteroperator, filtervalue, callback);
            });
        }
    };
};