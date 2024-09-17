<?php

require "../bootstrap.php";
require "../models/Usuario.php";

use App\Models\Usuario;

$dni = $_GET["dni"];

$usuario = Usuario::find($dni);
$usuario->delete();