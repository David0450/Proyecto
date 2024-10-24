<?php

/* $viewPath = __DIR__ . '/../view/index.html';

if (file_exists($viewPath)) {
    readfile($viewPath); 
} else {
    http_response_code(404);
    echo "View not found!";
} */

require "../bootstrap.php";
require "../models/Usuario.php";

use App\Models\Usuario;

// *Cuenta todos los registros de usuarios
$totalRecords = Usuario::count();

// *Criterios de búsqueda, ordenación y paginación (draw son las veces que hemos solicitado)
$limit = $_POST['length'];
$offset = $_POST['start'];
$search = $_POST['search']['value'];
$draw = $_POST['draw'];
$sortingColumn = $_POST['columns'][$_POST['order'][0]['column']?? '']['data'] ?? '';
$sortingDirection = $_POST['order'][0]['dir'] ?? '';

$query= Usuario::query();

// *Si hay un criterio de búsqueda, genera una query con WHERE
if (!empty($search)) {
    $query->where("dni","like","%".$search."%")
          ->orWhere("nombre","like","%".$search."%")
          ->orWhere("primerApellido","like","%".$search."%")
          ->orWhere("email","like","%".$search."%")
          ->orWhere("telefono","like","%".$search."%");
}

// *Si hay un criterio de ordenación, ordena con orderBy(columna, dirección)
if(!empty($sortingDirection)) {
    $query->orderBy($sortingColumn, $sortingDirection);
}

// *Cuenta todos los registros tras los criterios de búsqueda
$totalFiltered = $query->count();

// *Pagina los resultados
$usuarios = $query->offset($offset)
                    ->limit($limit)
                    ->get();

// *Transforma los resultados en un array
$usuariosArray = $usuarios->toArray();

// *Identifica cada valor de cada usuario y le añade un valor de acciones con estos datos (Borrar y Editar)
for ($i = 0; $i < count($usuariosArray); $i++) {
    $dni = $usuariosArray[$i]['dni'];
    $nombre = $usuariosArray[$i]['nombre'];
    $apellido = $usuariosArray[$i]['primerApellido'];
    $email = $usuariosArray[$i]['email'];
    $telefono = $usuariosArray[$i]['telefono'];
    $nombreCompleto = $usuariosArray[$i]['nombre']." ".$usuariosArray[$i]['primerApellido'];
    $usuariosArray[$i]["acciones"] = "<button onclick='botonEditarUsuario(\"$dni\",\"$nombre\",\"$apellido\",\"$email\",\"$telefono\",\"$nombreCompleto\")'><i class='fa-regular fa-pen-to-square actions'></i></button><button onclick='botonBorrarUsuario(\"$dni\",\"$nombreCompleto\")'><i class='fa-regular fa-trash-can actions'></i></button>";}

/*
*El resultado es el JSON que va a recoger AJAX, le indicamos las veces solicitadas, todos los registros,
* los registros filtrados y los datos extraídos*/
$resultado = [
    "draw" => intval($draw),
    "recordsTotal" => $totalRecords,
    "recordsFiltered" => $totalFiltered,
    "data" => $usuariosArray
];

echo json_encode($resultado);   