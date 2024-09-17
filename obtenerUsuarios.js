$(document).ready(function() {
    $('#miTabla').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "../controllers/obtenerUsuarios.php",
            type: "POST"
        },
        columns: [
            { data: "dni" },
            { data: "nombre" },
            { data: "primerApellido" },
            { data: "email" },
            { data: "telefono" },
            { data: "acciones" }
        ],
        pageLength: 10,
        language: {url: "../public/lang/espannol.json"},
        layout: {
            topStart: {
                buttons: [
                    {
                        text: "<i class='fa-regular fa-file-pdf'></i>",
                        extend: 'pdfHtml5',
                        download: 'open',
                        exportOptions: {
                            columns: [0,1,2,3,4]
                        },
                    },
                    {
                        text: "<i class='fa-regular fa-file-excel'></i>",
                        extend: "excelHtml5",
                    },
                    {
                        text: "<i class='fa-regular fa-paste'></i>",
                        extend: "copyHtml5",
                    },
                    {
                        text: "<i class='fa-solid fa-user-plus'></i>",
                        title: "Añadir usuario",
                        action: function(){
                            botonAñadirUsuario();
                        }
                    }
                ]
            },
        },
        select: true,
    });
});

function botonEditarUsuario(dni, nombre, apellido, email, telefono, nombreCompleto) {
    Swal.fire({
        title: "Editar usuario",
        html: `
        <input type="text" class="swal2-input" value="" id="input-nombre" style="width:25%; margin: 0 10px">
        <input type="text" class="swal2-input" value="" id="input-apellido" style="width:40%; margin: 0 10px">
        <input type="email" class="swal2-input" value="" id="input-email" style="width:70%">
        <input type="text" class="swal2-input" value="" id="input-telefono">
        `,
        confirmButtonText: "Editar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        preConfirm: () => {
            let nombreInput = document.getElementById("input-nombre").value == "" ? nombre : document.getElementById("input-nombre").value;
            let apellidoInput = document.getElementById("input-apellido").value == "" ? apellido : document.getElementById("input-apellido").value;
            let emailInput = document.getElementById("input-email").value == "" ? email : document.getElementById("input-email").value;
            let telefonoInput = document.getElementById("input-telefono").value == "" ? telefono : document.getElementById("input-telefono").value;

            return {nombreInput,apellidoInput,emailInput,telefonoInput};
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const editarAlert = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
            });
            editarAlert.fire({
                title: "¿Estás seguro?",
                text: "¿Estás seguro que quieres editar a "+nombre+" "+apellido+"?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, editar",
                cancelButtonText: "No, cancelar",
                confirmButtonColor: "limegreen",
                cancelButtonColor: "brown",
                preConfirm: () => {
                    let nombreInput = result.value.nombreInput;
                    let apellidoInput = result.value.apellidoInput;
                    let emailInput = result.value.emailInput;
                    let telefonoInput = result.value.telefonoInput;
                    return { nombreInput, apellidoInput, emailInput, telefonoInput};
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    jQuery.ajax({
                        type: "GET",
                        url: "../controllers/editarUsuarios.php",
                        dataType: "json",
                        data: { 
                             dni: dni,
                             nombre: result.value.nombreInput,
                             apellido: result.value.apellidoInput,
                             email: result.value.emailInput,
                             telefono: result.value.telefonoInput
                        }
                    });
                    editarAlert.fire({
                        title: "Editado",
                        text: "Has editado a "+nombreCompleto+" ("+dni+")",
                        icon: "success"
                    });
                    $("#miTabla").DataTable().rows().invalidate();
                    $("#miTabla").DataTable().draw();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    editarAlert.fire({
                        title: "Cancelado",
                        text: "El usuario no ha sido editado",
                        icon: "error"
                    });
                }
            })
        };
    }); 
    document.getElementById("input-nombre").value = nombre;
    document.getElementById("input-apellido").value = apellido;
    document.getElementById("input-email").value = email;
    document.getElementById("input-telefono").value = telefono;
}

function botonBorrarUsuario(dni, nombreCompleto) {
    
    const borrarAlert = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
    });
    borrarAlert.fire({
        title: "¿Estás seguro?",
        text: "Estás a punto de eliminar a "+nombreCompleto+" ("+dni+")",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "No, cancelar",
        confirmButtonColor: "limegreen",
        cancelButtonColor: "brown"
    }).then((result) => {
        if (result.isConfirmed) {
            jQuery.ajax({
                type: "GET",
                url: "../controllers/borrarUsuarios.php",
                dataType: "json",
                data: { dni: dni}
            });
            borrarAlert.fire({
                title: "Eliminado",
                text: "Has eliminado a "+nombreCompleto+" ("+dni+")",
                icon: "success"
            });
            $("#miTabla").DataTable().ajax.reload(null, false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            borrarAlert.fire({
                title: "Cancelado",
                text: "El usuario no ha sido eliminado",
                icon: "error"
            });
        }
    })
};

function botonAñadirUsuario() {
    const añadirAlert = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
    });
    añadirAlert.fire({
        title: "Añadir usuario",
        html: `<input type="text" class="swal2-input" value="" placeholder="DNI" id="input-dni" style="margin-bottom: 20px">
        <input type="text" class="swal2-input" value="" id="input-nombre" placeholder="Nombre" style="width:30%; margin: auto 5px">
        <input type="text" class="swal2-input" value="" id="input-apellido" placeholder="Apellido" style="width:40%; margin: auto 5px">
        <input type="email" class="swal2-input" value="" id="input-email" placeholder="Email" style="width:70%">
        <input type="text" class="swal2-input" value="" id="input-telefono" placeholder="Teléfono">
        `,
        confirmButtonText: "Añadir",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        confirmButtonColor: "limegreen",
        cancelButtonColor: "brown",
        preConfirm: () => {
            let dniInput = document.getElementById("input-dni").value;
            let nombreInput = document.getElementById("input-nombre").value;
            let apellidoInput = document.getElementById("input-apellido").value;
            let emailInput = document.getElementById("input-email").value;
            let telefonoInput = document.getElementById("input-telefono").value;

            return {dniInput,nombreInput,apellidoInput,emailInput,telefonoInput};
        }
    }).then((result) => {
        if (result.isConfirmed) {
            jQuery.ajax({
                type: "POST",
                url: "../controllers/annadirUsuarios.php",
                dataType: "json",
                data: 
                    { dni: result.value.dniInput,
                     nombre: result.value.nombreInput,
                     apellido: result.value.apellidoInput,
                     email: result.value.emailInput,
                     telefono: result.value.telefonoInput}
            });
            $("#miTabla").DataTable().ajax.reload(null,false);
        }
    })
}