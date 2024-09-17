<?php
namespace App\Models;

require '../vendor/autoload.php';

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model {
    protected $table = 'usuario';
    protected $primaryKey = "dni";
    public $incrementing = false;
    protected $fillable = ["dni","nombre","primerApellido","email","telefono"];
    public $timestamps = false;
}