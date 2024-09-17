<?php

require "../bootstrap.php";
require "../models/Usuario.php";

use App\Models\Usuario;

$dni = $_GET["dni"];
$nombre = $_GET["nombre"];
$apellido = $_GET["apellido"];
$email = $_GET["email"];
$telefono = $_GET["telefono"];

$usuario = Usuario::find($dni);

$usuario->update([
    "nombre" => $nombre,
    "primerApellido" => $apellido,
    "email" => $email,
    "telefono" => $telefono
]);