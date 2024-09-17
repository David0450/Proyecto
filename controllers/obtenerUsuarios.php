<?php

require "../bootstrap.php";
require "../models/Usuario.php";

use App\Models\Usuario;

$limit = $_POST['length'];
$offset = $_POST['start'];
$search = $_POST['search']['value'];
$draw = $_POST['draw'];

$query= Usuario::query();

if (!empty($search)) {
    $query->where("dni","like","%".$search."%")
          ->orWhere("nombre","like","%".$search."%")
          ->orWhere("primerApellido","like","%".$search."%")
          ->orWhere("email","like","%".$search."%")
          ->orWhere("telefono","like","%".$search."%");
}
$totalFiltered = $query->count();

$usuarios = $query->offset($offset)
                    ->limit($limit)
                    ->get();
$usuariosArray = $usuarios->toArray();
$totalRecords = Usuario::count();

for ($i = 0; $i < count($usuariosArray); $i++) {
    $dni = $usuariosArray[$i]['dni'];
    $nombre = $usuariosArray[$i]['nombre'];
    $apellido = $usuariosArray[$i]['primerApellido'];
    $email = $usuariosArray[$i]['email'];
    $telefono = $usuariosArray[$i]['telefono'];
    $nombreCompleto = $usuariosArray[$i]['nombre']." ".$usuariosArray[$i]['primerApellido'];
    $usuariosArray[$i]["acciones"] = "<button onclick='botonEditarUsuario(\"$dni\",\"$nombre\",\"$apellido\",\"$email\",\"$telefono\",\"$nombreCompleto\")'><i class='fa-regular fa-pen-to-square actions'></i></button><button onclick='botonBorrarUsuario(\"$dni\",\"$nombreCompleto\")'><i class='fa-regular fa-trash-can actions'></i></button>";}


$resultado = [
    "draw" => intval($draw),
    "recordsTotal" => $totalRecords,
    "recordsFiltered" => $totalFiltered,
    "data" => $usuariosArray
];

echo json_encode($resultado);   