<?php

require "../bootstrap.php";
require "../models/Usuario.php";

use App\Models\Usuario;

$dni = $_POST["dni"];
$nombre = $_POST["nombre"];
$apellido = $_POST["apellido"];
$email = $_POST["email"];
$telefono = $_POST["telefono"];

$usuario = Usuario::find($dni);

$usuario->update([
    "nombre" => $nombre,
    "primerApellido" => $apellido,
    "email" => $email,
    "telefono" => $telefono
]);