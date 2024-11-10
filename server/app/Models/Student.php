<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "students";
    protected $primaryKey = 'username';

    protected $fillable = [
        'username',
        'name', 
        'contact', 
        'email', 
        'gender', 
        'birthdate',
        'grade', 
        'section', 
        'program', 
        'track', 
        'course', 
        'religion', 
        'house_no', 
        'barangay', 
        'municipality', 
        'province', 
        'father_name', 
        'mother_name', 
        'guardian', 
        'guardian_rel', 
        'contact_rel', 
        'enrolled', 
        'year_enrolled', 
        'year_unenrolled', 
        'modality', 
        'created_by',
        'updated_by'
    ];
}
