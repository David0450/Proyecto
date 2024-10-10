<?php

require "../bootstrap.php";
require "../models/Usuario.php";

use App\Models\Usuario;

$dni = $_POST["dni"];

$usuario = Usuario::find($dni);
$usuario->delete();